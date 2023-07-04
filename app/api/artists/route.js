import { NextResponse } from 'next/server';
const xml2js = require('xml2js');
var parser = new xml2js.Parser();

export async function GET(request) {
  const response = await fetch('https://www.sakugabooru.com/tag.xml?type=1&limit=10000');
  const xml = await response.text();

  const json = await parser.parseStringPromise(xml);
  const data = json.tags.tag.map((tag) => tag['$']);
  return NextResponse.json({ data });
}
