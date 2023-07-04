'use client';

import { useEffect, useState } from 'react';
import Modal from './Modal';

const Shows = () => {
  const [shows, setShows] = useState([]);
  const [searchShows, setSearchShows] = useState('');
  const [currentShow, setCurrentShow] = useState('');
  const [currentShowPosts, setCurrentShowPosts] = useState([]);

  const [sortByEpisode, setSortByEpisode] = useState(false);

  const [videoOpen, setVideoOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState({});

  useEffect(() => {
    console.log('get all shows api called');
    fetch('/api/shows')
      .then((res) => res.json())
      .then((data) => {
        setShows(data.data);
      });
  }, []);

  useEffect(() => {
    console.log(currentVideo);
  }, [searchShows, currentVideo]);

  useEffect(() => {
    if (currentShow === '') {
      return;
    }
    console.log(`get ${currentShow}'s posts api called`);
    setCurrentShowPosts([]);
    fetch(`/api/shows/posts/${currentShow}?groupByEpisode=${sortByEpisode}`)
      .then((res) => res.json())
      .then((data) => {
        setCurrentShowPosts(data.data);
        console.log(data.data);
      });
  }, [currentShow, sortByEpisode]);

  return (
    <div className="container">
      <div>
        {currentVideo?.file_url && (
          <Modal
            isOpen={videoOpen}
            setOpen={setVideoOpen}
            currentVideo={{ ...currentVideo, series: currentShow }}
          />
        )}

        <button
          onClick={(e) => {
            setVideoOpen(!videoOpen);
          }}
        ></button>
      </div>
      <div className="">
        <input
          placeholder="Search Shows"
          className="text-black p-1 mb-2 mr-1 text-center"
          onChange={(e) => setSearchShows(e.target.value)}
        ></input>
        Sort by episode:
        <input
          type="checkbox"
          className=""
          checked={sortByEpisode}
          onChange={(e) => {
            setSortByEpisode(!sortByEpisode);
          }}
        />
      </div>

      <div className="flex flex-row flex-wrap gap-1">
        {shows
          .filter((s) => s.name.includes(searchShows.replaceAll(' ', '_')))
          .slice(0, 50)
          .map((show, index) => (
            <div key={index} className="bg-yellow-500 p-1">
              <button
                onClick={(e) => {
                  setCurrentShow(show.name);
                }}
              >
                {show.name.replaceAll('_', ' ')}
              </button>
            </div>
          ))}
      </div>

      <div className="flex flex-col gap-1">
        {currentShowPosts.map(([series, posts_from_series], i) => (
          <div key={i} className="bg-gray-900">
            <div className="bg-violet-600 p-2 text-center text-xl font-semibold">
              {series === 'undefined' ? 'Other' : series.replaceAll('_', ' ')} -{' '}
              {posts_from_series.length} posts
            </div>
            <div className="flex flex-row flex-wrap justify-center">
              {posts_from_series.map((post, index) => {
                return (
                  <div key={index}>
                    <button
                      onClick={(e) => {
                        setVideoOpen(true);
                        setCurrentVideo(post);
                      }}
                    >
                      <img src={post.preview_url}></img>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shows;
