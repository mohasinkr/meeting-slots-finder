import { getRedisData } from '@/lib/getRedisData';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const key = 'participants'; // Replace with your actual key

  const data = await getRedisData(key);

  if (data) {
    return NextResponse.json(data);
  } else {
    return NextResponse.json({ message: 'No data found' }, { status: 404 });
  }
}