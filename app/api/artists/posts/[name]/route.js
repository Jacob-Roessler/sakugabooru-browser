import { NextResponse } from 'next/server';
import cleanData from '@/helpers/cleanData';

const browserHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  Accept: 'application/json',
};

export async function GET(request, { params }) {
  const name = encodeURIComponent(params.name).replaceAll('%20', '_');

  // First page
  const response = await fetch(`https://www.sakugabooru.com/post.json?limit=1000&tags=${name}`, {
    headers: browserHeaders,
    next: { revalidate: 259200 },
  });

  let data = await response.json();

  if (data.length === 0) {
    return NextResponse.json({ data: [['No posts', []]] });
  }

  // Second page if needed
  if (data.length === 1000) {
    const response2 = await fetch(
      `https://www.sakugabooru.com/post.json?limit=1000&tags=${name}&page=2`,
      {
        headers: browserHeaders,
        next: { revalidate: 259200 },
      },
    );

    const data2 = await response2.json();
    data = [...data, ...data2];
  }

  // Tags
  const tagresponse = await fetch('https://www.sakugabooru.com/tag.json?type=1&limit=0', {
    headers: browserHeaders,
  });

  const tagdata = await tagresponse.json();

  // Clean + group
  data = cleanData(data, tagdata);

  const group_by_series = {};
  data.forEach((post) => {
    if (group_by_series[post.series]) {
      group_by_series[post.series].push(post);
    } else {
      group_by_series[post.series] = [post];
    }
  });

  // Sort series
  let sorted = Object.entries(group_by_series).sort((a, b) => {
    return b[1].length - a[1].length || a[0].localeCompare(b[0]);
  });

  // Sort posts inside each series
  sorted = sorted.map(([series, posts]) => [
    series,
    posts.sort((a, b) => a.source.localeCompare(b.source) || a.created_at - b.created_at),
  ]);

  return NextResponse.json({ data: sorted });
}
