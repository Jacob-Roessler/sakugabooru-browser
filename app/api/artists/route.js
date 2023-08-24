import { NextResponse } from 'next/server';

export async function GET(request) {
  const response = await fetch('https://www.sakugabooru.com/tag.json?type=1&limit=0');
  const data = await response.json();

  if (request.nextUrl.searchParams.get('sort') === 'true') {
    data.sort((a, b) => b.count - a.count);
  }

  return NextResponse.json({ data });
}
