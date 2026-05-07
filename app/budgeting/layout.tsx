import Link from 'next/link'
import { Footer } from '../footer'

export default function BudgetingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-medium text-zinc-900 dark:text-zinc-50 text-sm hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors">
              Joonbo Shim
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700 text-sm">/</span>
            <Link href="/budgeting" className="text-zinc-500 dark:text-zinc-400 text-sm hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
              Budget Planner
            </Link>
          </div>
          <Link href="/budgeting/guide" className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
            How it works
          </Link>
        </div>
      </header>

      <div className="flex-1">
        {children}
      </div>

      <div className="max-w-7xl mx-auto w-full px-4">
        <Footer />
      </div>
    </div>
  )
}
