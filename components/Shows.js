'use client';

import { useEffect, useState, useCallback } from 'react';
import Modal from './Modal';
import ShowsCard from './ShowsCard';
import Pagination from './Pagination';
import UseKeyboardShortcuts from './UseKeyboardShortcuts';
import ReactLoading from 'react-loading';

const Shows = ({ current }) => {
  const [shows, setShows] = useState([]);
  const [sortShows, setSortShows] = useState(false);
  const [pagination, setPagination] = useState(50);
  const [showsOffset, setShowsOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const [searchShows, setSearchShows] = useState(current ? current : '');
  const [currentShow, setCurrentShow] = useState(current ? current : '');
  const [currentShowPosts, setCurrentShowPosts] = useState([]);

  const [sortByEpisode, setSortByEpisode] = useState(false);
  const [autoFullscreen, setAutoFullscreen] = useState(false);

  const [videoOpen, setVideoOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState({});

  useEffect(() => {
    console.log('get all shows api called');
    fetch(`/api/shows?sort=${sortShows}`)
      .then((res) => res.json())
      .then((data) => {
        setShows(data.data);
      });
  }, [sortShows]);

  useEffect(() => {
    if (currentShow === '') {
      return;
    }
    console.log(`get ${currentShow}'s posts api called`);
    setLoading(true);
    setCurrentShowPosts([]);

    if (sortByEpisode) {
      fetch(`/api/shows/posts/${encodeURIComponent(currentShow)}/sortEpisodes`)
        .then((res) => res.json())
        .then((data) => {
          setCurrentShowPosts(data.data);
          setLoading(false);
        });
    } else {
      fetch(`/api/shows/posts/${encodeURIComponent(currentShow)}`)
        .then((res) => res.json())
        .then((data) => {
          setCurrentShowPosts(data.data);
          setLoading(false);
        });
    }
  }, [currentShow, sortByEpisode]);

  return (
    <div className="">
      <div>
        <UseKeyboardShortcuts
          setAutoFullscreen={setAutoFullscreen}
          autoFullscreen={autoFullscreen}
          offset={showsOffset}
          setOffset={setShowsOffset}
          setSearch={setSearchShows}
          search={searchShows}
          pagination={pagination}
          setSortByEpisode={setSortByEpisode}
          sortByEpisode={sortByEpisode}
        />
        {currentVideo?.file_url && (
          <Modal
            isOpen={videoOpen}
            setOpen={setVideoOpen}
            currentVideo={{ ...currentVideo, selected_series: currentShow }}
            goFullscreen={autoFullscreen}
            setCurrentVideo={setCurrentVideo}
          />
        )}

        <button
          onClick={(e) => {
            setVideoOpen(!videoOpen);
          }}
        ></button>
      </div>
      <div>
        {shows.length > 0 && (
          <Pagination
            setSearchTerm={setSearchShows}
            searchTerm={searchShows}
            offset={showsOffset}
            setOffset={setShowsOffset}
            list={shows}
            pagination={pagination}
            setPagination={setPagination}
            placeholder="Series"
          />
        )}

        <div className={`${shows.length === 0 ? 'invisible' : 'visible'} text-center w-full pb-1`}>
          <button onClick={() => setSortShows(!sortShows)}>
            Sorting By {sortShows ? 'Count' : 'Name'}
          </button>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-base-100 z-50 invisible sm:visible">
          <button
            className="hover:underline "
            onClick={() => {
              setAutoFullscreen(!autoFullscreen);
            }}
          >
            Fullscreen {`${autoFullscreen ? 'Yes' : 'No'}`}
          </button>
        </div>
        <button
          className="fixed bottom-0 right-0 p-4 bg-base-100 z-50 hover:scale-105"
          onClick={(e) => {
            setSortByEpisode(!sortByEpisode);
          }}
        >
          Sort by episode: {sortByEpisode ? 'Yes' : 'No'}
        </button>
      </div>

      <div className="flex flex-row  flex-wrap gap-1 justify-center mb-1">
        {shows
          .filter((s) => s.name.includes(searchShows.toLowerCase().replaceAll(' ', '_')))
          .slice(showsOffset, showsOffset + pagination)
          .map((show, index) => (
            <div
              key={index}
              className={`rounded ${
                show.name === currentShow.replaceAll(' ', '_') ? 'bg-green-500' : 'bg-violet-500'
              } p-1 text-sm sm:text-base  hover:bg-green-500`}
            >
              <button
                onClick={(e) => {
                  setCurrentShow(show.name);
                  const newUrl = `/shows/${encodeURIComponent(show.name)}`;
                  history.pushState({}, '', newUrl);
                }}
              >
                <span
                  className="lg:tooltip"
                  data-tip={`${show.count} Posts`}
                >{`${show.name.replaceAll('_', ' ')}`}</span>
              </button>
            </div>
          ))}
      </div>

      <div className="flex flex-col gap-1 mb-16">
        {loading ? (
          <div className="flex justify-center">
            <ReactLoading type="bars" color="#EAB308" width={200} height={100} />
          </div>
        ) : (
          currentShowPosts.map(([artist, posts_from_artist], i) => (
            <ShowsCard
              key={i}
              artist={artist}
              posts_from_artist={posts_from_artist}
              setCurrentVideo={setCurrentVideo}
              setVideoOpen={setVideoOpen}
              sortByEpisode={sortByEpisode}
              currentShow={currentShow}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Shows;
