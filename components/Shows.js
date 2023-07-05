'use client';

import { useEffect, useState } from 'react';
import Modal from './Modal';
import ShowsCard from './ShowsCard';

const Shows = ({ current }) => {
  const [shows, setShows] = useState([]);
  const [searchShows, setSearchShows] = useState(current ? current : '');
  const [currentShow, setCurrentShow] = useState(current ? current : '');
  const [currentShowPosts, setCurrentShowPosts] = useState([]);

  const [sortByEpisode, setSortByEpisode] = useState(false);
  const [autoFullscreen, setAutoFullscreen] = useState(true);
  const [collapseAll, setCollapseAll] = useState(true);

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
            goFullscreen={autoFullscreen}
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
          className="text-black mb-2 p-1  text-center"
          onChange={(e) => setSearchShows(e.target.value)}
        ></input>
        <button
          className="fixed bottom-0 right-0 p-4 bg-slate-800 z-[51] hover:scale-105"
          onClick={(e) => {
            setSortByEpisode(!sortByEpisode);
          }}
        >
          Sort by episode: {sortByEpisode ? 'Yes' : 'No'}
        </button>
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-800 z-50 invisible sm:visible">
          <button
            className="hover:underline "
            onClick={() => {
              setAutoFullscreen(!autoFullscreen);
            }}
          >
            Fullscreen {`${autoFullscreen ? 'Yes' : 'No'}`}
          </button>
        </div>
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
          <ShowsCard
            key={i}
            series={series}
            posts_from_series={posts_from_series}
            setCurrentVideo={setCurrentVideo}
            setVideoOpen={setVideoOpen}
            sortByEpisode={sortByEpisode}
          />
        ))}
      </div>
    </div>
  );
};

export default Shows;
