import { NextResponse } from 'next/server';

const general_tags = [
  'animated',
  'effects',
  'character_acting',
  'smoke',
  'smears',
  'fighting',
  'creatures',
  'liquid',
  'debris',
  'explosions',
  'hair',
  'production_materials',
  'western',
  'fabric',
  'running',
  'background_animation',
  'mecha',
  'fire',
  'animals',
  'sparks',
  'genga',
  'impact_frames',
  'lightning',
  'cgi',
  'beams',
  'vehicle',
  'wind',
  'performance',
  'rotation',
  'sports',
  'walk_cycle',
  'web',
  'dancing',
  'morphing',
  'flying',
  'falling',
  '3d_background',
  'eastern',
  'layout',
  'crowd',
  'missiles',
  'settei',
  'food',
  'crying',
  'storyboard',
  'henshin',
  'character_design',
  'ice',
  'black_and_white',
  'correction',
  'illustration',
  'rotoscope',
  'genga_comparison',
  'instruments',
  'henkei',
  'gattai',
  'live_action',
  'title_animation',
  'douga',
  'background_design',
  'concept_art',
  'timesheet',
  'sprite',
  'mechanical_design',
  'screencap',
  'comparison',
  'flipbook',
  'rough',
  'thumbs_up',
  'stop_motion',
  'tagme',
  'merry_christmas',
  'presumed',
  'remake',
  'umakoshi_eye',
  'kutsuna_lightning',
  'ebata_walk',
  'hisashi_punch',
  'wakame_shadows',
  'kanada_dragon',
  'kanada_light_flare',
  'obari_punch',
  'yutapon_cubes',
  'itano_circus',
];

export async function GET(req, { params }) {
  const title = params.title.replaceAll('$', '/');

  const groupByEpisode = 'true';

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

  tagdata = tagdata.map((tagObj) => {
    return tagObj.name;
  });

  data = data.map((post) => ({
    ...post,
    artists: post.tags
      .split(' ')
      .filter((tag) => !general_tags.includes(tag) && tagdata.includes(tag)),
    source: post.source.includes('#') ? post.source : `Source: ${post.source}`,
  }));

  let grouped = {};
  if (groupByEpisode === 'true') {
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
  } else {
    data.forEach((post) => {
      post.artists.forEach((artist) => {
        artist in grouped ? grouped[artist].push(post) : (grouped[artist] = [post]);
      });
    });
    data = Object.entries(grouped)
      .sort((a, b) => {
        return a[1].length - b[1].length;
      })
      .reverse();
  }

  data = data.map(([series, posts], index) => {
    return [series, posts.sort((a, b) => a.created_at - b.created_at)];
  });

  return NextResponse.json({ data });
}
