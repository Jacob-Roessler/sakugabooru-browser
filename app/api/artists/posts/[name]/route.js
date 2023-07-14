import { NextResponse } from 'next/server';
import cleanData from '@/helpers/cleanData';

export async function GET(req, { params }) {
  console.log(params);
  const name = encodeURIComponent(params.name);
  const response = await fetch(`https://www.sakugabooru.com/post.json?limit=1000&tags=${name}`);
  let data = await response.json();

  if (data.length === 0) {
    return NextResponse.json({ data: [['No posts', []]] });
  }

  if (data.length === 1000) {
    const response2 = await fetch(
      `https://www.sakugabooru.com/post.json?limit=1000&tags=${name}&page=2`
    );
    let data2 = await response2.json();
    data = [...data, ...data2];
  }

  const tagresponse = await fetch('https://www.sakugabooru.com/tag.json?type=1&limit=0');
  let tagdata = await tagresponse.json();

  data = cleanData(data, tagdata);

  let group_by_series = {};
  data.forEach((post) => {
    post.series in group_by_series
      ? group_by_series[post.series].push(post)
      : (group_by_series[post.series] = [post]);
  });

  //Sort series by greatest number of artist contributions if contributions are the same then sort by name (ascending)
  data = Object.entries(group_by_series).sort((a, b) => {
    return b[1].length - a[1].length || a[0].localeCompare(b[0]);
  });

  //Sort posts in a series by the source (starting at 1) then by when it was created (earliest first)
  data = data.map(([series, posts], index) => {
    return [
      series,
      posts.sort((a, b) => a.source.localeCompare(b.source) || a.created_at - b.created_at),
    ];
  });

  return NextResponse.json({ data });
}
