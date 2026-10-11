'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/app/header';
import { Footer } from '@/app/footer';

interface TrackedItem {
  url: string;
  targetPrice: number;
  email: string;
}

export default function PriceTracker() {
  const [url, setUrl] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [email, setEmail] = useState('');
  const [trackedItems, setTrackedItems] = useState<TrackedItem[]>([]);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('trackedPrices');
    if (saved) setTrackedItems(JSON.parse(saved));
  }, []);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');

    const newItem = { url, targetPrice: Number(targetPrice), email };

    // 1. Save to LocalStorage (for instant UI feedback)
    const updatedItems = [...trackedItems, newItem];
    setTrackedItems(updatedItems);
    localStorage.setItem('trackedPrices', JSON.stringify(updatedItems));

    // 2. Save to Backend
    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      
      if (res.ok) {
        setStatus('✅ Tracking started. We will email you when the price drops.');
        setUrl(''); 
        setTargetPrice(''); 
        setEmail('');
      } else {
        setStatus('❌ Failed to save to server.');
      }
    } catch (err) {
      setStatus('❌ Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-50 dark:bg-zinc-950">
      <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 pt-20 pb-20">
        <Header />
        
        <div className="mt-12 space-y-8">
          {/* Header Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Price Tracker
            </h1>
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              Paste a product URL, set your target price, and we will notify you when it drops.
            </p>
          </div>

          {/* Form Card */}
          <form onSubmit={handleTrack} className="space-y-4 rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30">
            <div className="rounded-[15px] bg-white p-6 dark:bg-zinc-950 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Product URL
                </label>
                <input 
                  type="url" 
                  required 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-zinc-50"
                  placeholder="https://example.com/product" 
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Target Price ($)
                  </label>
                  <input 
                    type="number" 
                    required 
                    step="0.01" 
                    value={targetPrice} 
                    onChange={(e) => setTargetPrice(e.target.value)} 
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-zinc-50"
                    placeholder="99.99" 
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Your Email
                  </label>
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-zinc-50"
                    placeholder="you@example.com" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="mt-2 w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-50 transition-colors duration-200 hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {isLoading ? 'Saving...' : 'Start Tracking'}
              </button>

              {status && (
                <p className="text-center text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {status}
                </p>
              )}
            </div>
          </form>

          {/* List Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
              Your Tracked Items
            </h2>
            
            {trackedItems.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-800">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No items tracked yet. Add one above to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {trackedItems.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="group relative overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30"
                  >
                    <div className="relative h-full w-full rounded-[15px] bg-white p-4 dark:bg-zinc-950">
                      <div className="flex w-full flex-row justify-between items-start gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-normal text-zinc-900 dark:text-zinc-100">
                            {item.url}
                          </p>
                          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            Target: <span className="font-medium text-zinc-900 dark:text-zinc-50">${item.targetPrice}</span> → {item.email}
                          </p>
                        </div>
                        <button 
                          onClick={() => {
                            const filtered = trackedItems.filter((_, i) => i !== idx);
                            setTrackedItems(filtered);
                            localStorage.setItem('trackedPrices', JSON.stringify(filtered));
                          }}
                          className="shrink-0 rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors duration-200 hover:bg-red-100 hover:text-red-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}