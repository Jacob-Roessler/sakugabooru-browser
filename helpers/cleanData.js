import { general_tags } from './general_tags.json';

export default function cleanData(postsData, tagsData) {
  let artistsTags = {};
  let generalTags = {};

  tagsData.forEach((tagObj) => {
    artistsTags[tagObj.name] = 'artist';
  });

  general_tags.forEach((tag) => {
    generalTags[tag] = 'general';
  });

  const data = postsData.map((post) => {
    //Partition artists and series tags
    let artists = [];
    let series = [];
    post.tags.split(' ').forEach((tag) => {
      if (!(tag in generalTags)) {
        tag in artistsTags ? artists.push(tag) : series.push(tag);
      }
    });
    let source = post.source.trim();
    if (post.source.length > 0 && !post.source.includes('#')) {
      source = `Source: ${post.source}`;
    }

    return {
      ...post,
      series: series,
      artists: artists,
      source: source,
    };
  });

  return data;
}
