'use client';

import { useEffect, useState } from 'react';
import Modal from './Modal';

const Shows = () => {
  const [shows, setShows] = useState([]);
  const [searchShows, setSearchShows] = useState('');
  const [currentShow, setCurrentShow] = useState('');
  const [currentShowPosts, setCurrentShowPosts] = useState([]);
  const [showUnkown, setShowUnknown] = useState(false);

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
    if (sortByEpisode) {
      fetch(`/api/shows/posts/${currentShow}/sortEpisodes`)
        .then((res) => res.json())
        .then((data) => {
          setCurrentShowPosts(data.data);
          console.log(data.data);
        });
    } else {
      fetch(`/api/shows/posts/${currentShow}`)
        .then((res) => res.json())
        .then((data) => {
          setCurrentShowPosts(data.data);
          console.log(data.data);
        });
    }
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
      <div className="flex flex-col items-center justify-center text-sm sm:text-base">
        <input
          placeholder="Search Shows"
          className="text-black p-1 mb-2 mr-1 text-center max-w-[230px]"
          onChange={(e) => setSearchShows(e.target.value)}
        ></input>
        <span className="">
          Sort by episode:{' '}
          <input
            type="checkbox"
            className="mb-2"
            checked={sortByEpisode}
            onChange={(e) => {
              setSortByEpisode(!sortByEpisode);
            }}
          />
        </span>
      </div>

      <div className="flex flex-row flex-wrap gap-1 mb-1">
        {shows
          .filter((s) => s.name.includes(searchShows.toLowerCase().replaceAll(' ', '_')))
          .slice(0, 50)
          .map((show, index) => (
            <div
              key={index}
              className={`bg-violet-500 ${
                show.name === currentShow && 'bg-green-500'
              } p-1 text-sm sm:text-base`}
            >
              <button
                onClick={(e) => {
                  setCurrentShow(show.name.replaceAll('/', '$'));
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
            <div className="bg-yellow-500 p-2 text-center text-xl font-semibold flex flex-col sticky top-0 sm:static">
              {series === 'undefined' ? 'Other' : series.replaceAll('_', ' ')} -{' '}
              {posts_from_series.length} posts
              {series === 'artist_unknown' && (
                <button
                  className=""
                  onClick={(e) => {
                    setShowUnknown(!showUnkown);
                  }}
                >
                  <span className="bg-violet-700 p-1">{showUnkown ? 'Hide' : 'Show'} Unkown</span>
                </button>
              )}
            </div>
            <div
              className={`flex flex-row flex-wrap justify-center ${
                series === 'artist_unknown' && !showUnkown ? 'hidden' : ''
              }`}
            >
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
