import { NextResponse } from 'next/server';
import cleanData from '@/helpers/cleanData';

export async function GET(req, { params }) {
  const title = encodeURIComponent(params.title).replaceAll('%20', '_');

  const response = await fetch(`https://www.sakugabooru.com/post.json?limit=1000&tags=${title}`);
  let data = await response.json();

  if (data.length === 0) {
    return NextResponse.json({ data: [['No posts', []]] });
  }

  if (data.length === 1000) {
    const response2 = await fetch(
      `https://www.sakugabooru.com/post.json?limit=1000&tags=${title}&page=2`
    );
    let data2 = await response2.json();
    data = [...data, ...data2];
  }

  const tagresponse = await fetch('https://www.sakugabooru.com/tag.json?type=1&limit=0');
  let tagdata = await tagresponse.json();

  data = cleanData(data, tagdata);

  //Group posts by their source
  let grouped = {};
  data.forEach((post) => {
    let s = post.source.trim();
    if (s[0] === '#') {
      s = s.split(' ')[0];
      s in grouped ? grouped[s].push(post) : (grouped[s] = [post]);
    } else {
      'Non-Episode Source' in grouped
        ? grouped['Non-Episode Source'].push(post)
        : (grouped['Non-Episode Source'] = [post]);
    }
  });

  data = Object.entries(grouped).sort((a, b) => {
    return a[0].localeCompare(b[0]);
  });

  data = data.map(([series, posts], index) => {
    return [series, posts.sort((a, b) => a.created_at - b.created_at)];
  });

  return NextResponse.json({ data });
}
