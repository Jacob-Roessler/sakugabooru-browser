import { NextResponse } from 'next/server';

export async function GET(request) {
  const response = await fetch('https://www.sakugabooru.com/tag.json?type=3&limit=0', {
    next: { revalidate: 86400 },
  });
  const data = await response.json();

  if (request.nextUrl.searchParams.get('sort') === 'true') {
    data.sort((a, b) => b.count - a.count);
  }

  return NextResponse.json({ data });
}
