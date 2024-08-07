'use client';

import { useEffect, useState, useCallback } from 'react';
import Modal from './Modal';
import ArtistsCard from './ArtistsCard';
import Pagination from './Pagination';
import UseKeyboardShortcuts from './UseKeyboardShortcuts';
import ReactLoading from 'react-loading';

const Artists = ({ current }) => {
  const [artists, setArtists] = useState([]);
  const [sortArtists, setSortArtists] = useState(false);
  const [pagination, setPagination] = useState(50);
  const [artistsOffset, setArtistsOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const [searchArtists, setSearchArtists] = useState(current ? current : '');
  const [currentArtist, setCurrentArtist] = useState(current ? current : '');
  const [currentArtistPosts, setCurrentArtistPosts] = useState([]);

  const [videoOpen, setVideoOpen] = useState(false);
  const [autoFullscreen, setAutoFullscreen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState({});

  useEffect(() => {
    console.log('get first page of artists api called');
    fetch(`/api/artists?sort=${sortArtists}`)
      .then((res) => res.json())
      .then((data) => {
        setArtists(data.data);
      });
  }, [sortArtists]);

  useEffect(() => {
    if (currentArtist === '') {
      return;
    }
    console.log(`get ${currentArtist}'s posts api called`);
    setLoading(true);
    setCurrentArtistPosts([]);
    fetch(`/api/artists/posts/${encodeURIComponent(currentArtist)}`)
      .then((res) => res.json())
      .then((data) => {
        setCurrentArtistPosts(data.data);
        setLoading(false);
      });
  }, [currentArtist]);

  return (
    <div className="">
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-base-100 hover:underline z-50 invisible sm:visible">
        <UseKeyboardShortcuts
          setAutoFullscreen={setAutoFullscreen}
          autoFullscreen={autoFullscreen}
          offset={artistsOffset}
          setOffset={setArtistsOffset}
          setSearch={setSearchArtists}
          search={searchArtists}
          pagination={pagination}
        />
        <button
          className="hover:underline"
          onClick={() => {
            setAutoFullscreen(!autoFullscreen);
          }}
        >
          Fullscreen {`${autoFullscreen ? 'Yes' : 'No'}`}
        </button>{' '}
      </div>
      <div>
        {currentVideo?.file_url && (
          <Modal
            isOpen={videoOpen}
            setOpen={setVideoOpen}
            currentVideo={currentVideo}
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

      {artists.length > 0 && (
        <Pagination
          setSearchTerm={setSearchArtists}
          searchTerm={searchArtists}
          offset={artistsOffset}
          setOffset={setArtistsOffset}
          list={artists}
          pagination={pagination}
          setPagination={setPagination}
          placeholder="Artists"
        />
      )}

      <div className={`w-full ${artists.length === 0 ? 'invisible' : 'visible'} text-center pb-1`}>
        <button className="w-fit" onClick={() => setSortArtists(!sortArtists)}>
          Sorting By {sortArtists ? 'Count' : 'Name'}
        </button>
      </div>

      <div className="flex flex-row flex-wrap gap-1 justify-center mb-1">
        {artists
          .filter((artist) => {
            return artist.name.includes(searchArtists.toLowerCase().replace(' ', '_'));
          })
          .slice(artistsOffset, artistsOffset + pagination)
          .map((artist, index) => {
            return (
              <div
                className={`rounded ${
                  artist.name === currentArtist.replaceAll(' ', '_') ? 'bg-green-500' : 'bg-red-600'
                } p-1 text-sm sm:text-base break-all sm:break-auto text-center hover:bg-green-500`}
                key={artist.id}
              >
                <button
                  onClick={(e) => {
                    setCurrentArtist(artist.name);
                    const newUrl = `/artists/${artist.name}`;
                    history.pushState({}, '', newUrl);
                  }}
                >
                  <span
                    className="lg:tooltip"
                    data-tip={`${artist.count} Posts`}
                  >{`${artist.name.replaceAll('_', ' ')}`}</span>
                </button>
              </div>
            );
          })}
      </div>

      <div className="flex flex-col gap-1 mb-16">
        {loading ? (
          <div className="flex justify-center">
            <ReactLoading type="bars" color="#7C3AED" width={200} height={100} />
          </div>
        ) : (
          currentArtistPosts.map(([series, posts_from_series], i) => (
            <ArtistsCard
              setVideoOpen={setVideoOpen}
              setCurrentVideo={setCurrentVideo}
              key={i}
              series={series}
              posts_from_series={posts_from_series}
              currentArtist={currentArtist}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Artists;
