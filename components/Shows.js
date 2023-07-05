'use client';

import { useEffect, useState } from 'react';
import Modal from './Modal';

const Shows = ({ current }) => {
  const [shows, setShows] = useState([]);
  const [searchShows, setSearchShows] = useState(current ? current : '');
  const [currentShow, setCurrentShow] = useState(current ? current : '');
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
    <div className="">
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

      <div className="flex flex-row flex-wrap gap-1 justify-center mb-1">
        {shows
          .filter((s) => s.name.includes(searchShows.toLowerCase().replaceAll(' ', '_')))
          .slice(0, 50)
          .map((show, index) => (
            <div
              key={index}
              className={` ${
                show.name === currentShow ? 'bg-green-500' : 'bg-violet-500'
              } p-1 text-sm sm:text-base `}
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
            <div className="bg-yellow-500 p-2 text-black text-center text-xl font-semibold flex flex-col sticky top-0 md:static">
              <a
                target="_blank"
                href={!sortByEpisode && `/artists/${series}`}
                className={`${!sortByEpisode && 'hover:underline'} `}
              >
                {series === 'undefined' ? 'Other' : series.replaceAll('_', ' ')} -{' '}
                {posts_from_series.length} posts
              </a>
              {series === 'artist_unknown' && (
                <button
                  className=""
                  onClick={(e) => {
                    setShowUnknown(!showUnkown);
                  }}
                >
                  <span className="bg-violet-700 text-white p-1">
                    {showUnkown ? 'Hide' : 'Show'} Unkown
                  </span>
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
                  <div
                    key={index}
                    className="group basis-1/2 sm:basis-1/3 md:basis-1/6 2xl:basis-auto"
                  >
                    <button
                      onClick={(e) => {
                        setVideoOpen(true);
                        setCurrentVideo(post);
                      }}
                    >
                      <div className=" h-full w-full relative inline text-blue-300 text-2xl flex text-center justify-center align-middle content-center break-all">
                        <p className="absolute flex h-full items-center invisible group-hover:visible ">
                          {post.artists && `By ${post.artists.join(' ')}`}
                        </p>
                        <img src={post.preview_url}></img>
                      </div>
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
