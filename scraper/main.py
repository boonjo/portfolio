import os
import re
import logging
import psycopg2
import requests
from bs4 import BeautifulSoup
import resend
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

# Environment variables (set by GitHub Actions)
DATABASE_URL = os.getenv("DATABASE_URL")
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
RESEND_FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL", "onboarding@resend.dev")

resend.api_key = RESEND_API_KEY

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

def extract_price(html_content):
    """Generic price extractor. Looks for $XX.XX patterns."""
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # 1. Try to find price in common meta tags
    meta_price = soup.find('meta', property='product:price:amount')
    if meta_price and meta_price.get('content'):
        return float(meta_price['content'].replace(',', ''))

    # 2. Fallback: Regex search for currency patterns (e.g., $19.99 or 19.99)
    # Looks for $ followed by numbers, or numbers with 2 decimal places near "price"
    text = soup.get_text(separator=' ', strip=True)
    matches = re.findall(r'\$?(\d{1,3}(?:,\d{3})*\.\d{2})', text)
    
    if matches:
        # Clean up commas and return the first valid price found
        return float(matches[0].replace(',', ''))
    
    return None

def check_prices():
    conn = get_db_connection()
    cur = conn.cursor()

    # Fetch all active trackers
    cur.execute("""
        SELECT id, url, target_price, email 
        FROM price_trackers 
        WHERE is_active = true
    """)
    trackers = cur.fetchall()
    logging.info(f"Found {len(trackers)} active trackers to check.")

    for tracker_id, url, target_price, email in trackers:
        try:
            logging.info(f"Checking: {url}")
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            current_price = extract_price(response.text)
            
            if current_price is not None:
                logging.info(f"  -> Found price: ${current_price} (Target: ${target_price})")
                
                # Update database
                cur.execute("""
                    UPDATE price_trackers 
                    SET current_price = %s, last_checked = NOW() 
                    WHERE id = %s
                """, (current_price, tracker_id))
                conn.commit()

                # Check if price dropped to or below target
                if current_price <= target_price:
                    logging.info(f"  -> 🎯 TARGET MET! Sending email to {email}")
                    send_alert_email(email, url, current_price, target_price)
            else:
                logging.warning(f"  -> Could not extract price. Updating last_checked only.")
                cur.execute("""
                    UPDATE price_trackers 
                    SET last_checked = NOW() 
                    WHERE id = %s
                """, (tracker_id,))
                conn.commit()

        except Exception as e:
            logging.error(f"Failed to check {url}: {e}")
            # Optionally mark as inactive if it fails repeatedly, but for now we just log.

    cur.close()
    conn.close()
    logging.info("✅ Price check completed.")

def send_alert_email(to_email, url, current_price, target_price):
    try:
        params = resend.Emails.SendParams(
            from_=RESEND_FROM_EMAIL,
            to=[to_email],
            subject=f"🎯 Price Drop Alert! Item is now ${current_price}",
            html=f"""
                <h2>Price Drop Alert!</h2>
                <p>Good news! The item you are tracking has dropped to or below your target price.</p>
                <ul>
                    <li><strong>Current Price:</strong> ${current_price}</li>
                    <li><strong>Your Target:</strong> ${target_price}</li>
                </ul>
                <p><a href="{url}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Product</a></p>
                <p style="color: #666; font-size: 12px; margin-top: 30px;">Powered by joonbo.com Price Tracker</p>
            """
        )
        resend.Emails.send(params)
    except Exception as e:
        logging.error(f"Failed to send email: {e}")

if __name__ == "__main__":
    check_prices()