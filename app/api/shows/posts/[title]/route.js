import { NextResponse } from 'next/server';
import cleanData from '@/helpers/cleanData';

export async function GET(req, { params }) {
  const title = encodeURIComponent(params.title).replaceAll('%20', '_');

  const response = await fetch(`https://www.sakugabooru.com/post.json?limit=1000&tags=${title}`, {
    next: { revalidate: 259200 },
  });
  let data = await response.json();

  if (data.length === 0) {
    return NextResponse.json({ data: [['No posts', []]] });
  }

  if (data.length === 1000) {
    const response2 = await fetch(
      `https://www.sakugabooru.com/post.json?limit=1000&tags=${title}&page=2`,
      { next: { revalidate: 259200 } }
    );
    let data2 = await response2.json();
    data = [...data, ...data2];
  }

  const tagresponse = await fetch('https://www.sakugabooru.com/tag.json?type=1&limit=0', {
    next: { revalidate: 86400 },
  });
  let tagdata = await tagresponse.json();

  data = cleanData(data, tagdata);

  //Group posts by their artist
  let grouped = {};

  data.forEach((post) => {
    post.artists.forEach((artist) => {
      artist in grouped ? grouped[artist].push(post) : (grouped[artist] = [post]);
    });
  });

  //Sort artists in series by greatest number of ontributions if contributions are the same then sort by name (ascending)
  data = Object.entries(grouped).sort((a, b) => {
    return b[1].length - a[1].length || a[0].localeCompare(b[0]);
  });

  //Sort posts by an artist by the source (starting at 1) then by when it was created (earliest first)
  data = data.map(([series, posts], index) => {
    return [
      series,
      posts.sort((a, b) => a.source.localeCompare(b.source) || a.created_at - b.created_at),
    ];
  });

  return NextResponse.json({ data });
}
