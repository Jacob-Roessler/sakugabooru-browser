import { NextResponse } from 'next/server';
const xml2js = require('xml2js');
var parser = new xml2js.Parser();
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
  'artist_unknown',
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
  console.log(params);
  const name = params.name;
  const response = await fetch(`https://www.sakugabooru.com/post.xml?limit=1000&tags=${name}`);
  const xml = await response.text();

  const json = await parser.parseStringPromise(xml);
  if (json.posts['$'].count === '0') {
    return NextResponse.json({ data: [['No posts', []]] });
  }

  const tagresponse = await fetch('https://www.sakugabooru.com/tag.xml?type=1&limit=0');
  const tagxml = await tagresponse.text();

  const tagjson = await parser.parseStringPromise(tagxml);
  let tagdata = tagjson.tags.tag.map((tag) => tag['$']);
  tagdata = tagdata.map((tagObj) => {
    return tagObj.name;
  });

  let data = json.posts.post.map((p) => p['$']);
  data = data.map((post) => ({
    ...post,
    series: post.tags
      .split(' ')
      .filter((tag) => !general_tags.includes(tag) && !tagdata.includes(tag)),
  }));

  let group_by_series = {};
  data.forEach((post) => {
    post.series in group_by_series
      ? group_by_series[post.series].push(post)
      : (group_by_series[post.series] = [post]);
  });

  data = Object.entries(group_by_series)
    .sort((a, b) => {
      return a[1].length - b[1].length;
    })
    .reverse();

  data = data.map(([series, posts], index) => {
    return [series, posts.sort((a, b) => a.source.localeCompare(b.source))];
  });

  return NextResponse.json({ data });
}
