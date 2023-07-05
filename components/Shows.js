'use client';

import { useEffect, useState } from 'react';
import Modal from './Modal';
import ShowsCard from './ShowsCard';

import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

const Shows = ({ current }) => {
  const [shows, setShows] = useState([]);
  const [showsOffset, setShowsOffset] = useState(0);

  const [searchShows, setSearchShows] = useState(current ? current : '');
  const [currentShow, setCurrentShow] = useState(current ? current : '');
  const [currentShowPosts, setCurrentShowPosts] = useState([]);

  const [sortByEpisode, setSortByEpisode] = useState(false);
  const [autoFullscreen, setAutoFullscreen] = useState(false);

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
      <div className="flex flex-row items-center justify-center text-sm sm:text-base mb-2">
        <div className="flex flex-row justify-center content-center text-sm sm:text-base mb-2">
          <button
            className="bg-slate-800 px-2"
            onClick={(e) => {
              setShowsOffset(0);
            }}
          >
            <RiArrowLeftSLine />
            <RiArrowLeftSLine />
          </button>
          <button
            className="bg-slate-800 px-2"
            onClick={(e) => {
              setShowsOffset(Math.max(0, showsOffset - 50));
            }}
          >
            <RiArrowLeftSLine />
          </button>
          <input
            placeholder={current ? `${current}` : `Search Shows`}
            className="text-black p-2  text-center"
            onChange={(e) => {
              setShowsOffset(0);
              setSearchShows(e.target.value);
            }}
          ></input>
          <button
            className="bg-slate-800 px-2"
            onClick={(e) => {
              setShowsOffset(
                Math.min(
                  shows.filter((s) =>
                    s.name.includes(searchShows.toLowerCase().replaceAll(' ', '_'))
                  ).length - 50,
                  showsOffset + 50
                )
              );
            }}
          >
            <RiArrowRightSLine />
          </button>
          <button
            className="bg-slate-800 px-2"
            onClick={(e) => {
              setShowsOffset(
                shows.filter((s) => s.name.includes(searchShows.toLowerCase().replaceAll(' ', '_')))
                  .length - 50
              );
            }}
          >
            <RiArrowRightSLine />
            <RiArrowRightSLine />
          </button>
        </div>

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

      <button
        className="fixed bottom-0 right-0 p-4 bg-slate-800 z-[51] hover:scale-105"
        onClick={(e) => {
          setSortByEpisode(!sortByEpisode);
        }}
      >
        Sort by episode: {sortByEpisode ? 'Yes' : 'No'}
      </button>

      <div className="flex flex-row flex-wrap gap-1 justify-center mb-1">
        {shows
          .filter((s) => s.name.includes(searchShows.toLowerCase().replaceAll(' ', '_')))
          .slice(showsOffset, showsOffset + 50)
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
