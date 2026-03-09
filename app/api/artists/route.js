import { NextResponse } from 'next/server';

const browserHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  Accept: 'application/json',
};

export async function GET(request) {
  const response = await fetch('https://www.sakugabooru.com/tag.json?type=1&limit=0', {
    headers: browserHeaders,
    next: { revalidate: 86400 },
  });

  const data = await response.json();

  if (request.nextUrl.searchParams.get('sort') === 'true') {
    data.sort((a, b) => b.count - a.count);
  }

  return NextResponse.json({ data });
}
