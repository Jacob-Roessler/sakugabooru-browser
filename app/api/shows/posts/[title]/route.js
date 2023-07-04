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

  const groupByEpisode = 'false';

  const response = await fetch(`https://www.sakugabooru.com/post.xml?limit=1000&tags=${title}`);
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
    artists: post.tags
      .split(' ')
      .filter((tag) => !general_tags.includes(tag) && tagdata.includes(tag)),
    source: post.source.includes('#') ? post.source : '##other##',
  }));

  let grouped = {};
  if (groupByEpisode === 'true') {
    data.forEach((post) => {
      post.source in grouped ? grouped[post.source].push(post) : (grouped[post.source] = [post]);
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
    data = data.map(([artist, posts], index) => {
      return [artist, posts.sort((a, b) => a.source.localeCompare(b.source))];
    });
  }

  return NextResponse.json({ data });
}
