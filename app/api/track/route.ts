import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Initialize the Neon client
const sql = neon(process.env.HEALTHBALL_DATABASE_URL!);

export async function POST(req: Request) {
  try {
    const { url, targetPrice, email } = await req.json();

    if (!url || !targetPrice || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert into Neon PostgreSQL
    await sql`
      INSERT INTO price_trackers (url, target_price, email, is_active)
      VALUES (${url}, ${targetPrice}, ${email}, true)
    `;

    return NextResponse.json({ success: true, message: 'Tracking started' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to save tracker' }, { status: 500 });
  }
}