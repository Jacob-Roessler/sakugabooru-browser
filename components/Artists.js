'use client';

import { useEffect, useState } from 'react';
import Modal from './Modal';
import ArtistsCard from './ArtistsCard';
import Pagination from './Pagination';

const pagination = 50;

const Artists = ({ current }) => {
  const [artists, setArtists] = useState([]);
  const [artistsOffset, setArtistsOffset] = useState(0);

  const [searchArtists, setSearchArtists] = useState(current ? current : '');
  const [currentArtist, setCurrentArtist] = useState(current ? current : '');
  const [currentArtistPosts, setCurrentArtistPosts] = useState([]);

  const [videoOpen, setVideoOpen] = useState(false);
  const [autoFullscreen, setAutoFullscreen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState({});

  useEffect(() => {
    console.log('get first page of artists api called');
    fetch('/api/artists')
      .then((res) => res.json())
      .then((data) => {
        setArtists(data.data);
      });
  }, []);

  useEffect(() => {
    console.log(currentVideo);
  }, [searchArtists, currentVideo]);

  useEffect(() => {
    if (currentArtist === '') {
      return;
    }
    console.log(`get ${currentArtist}'s posts api called`);
    setCurrentArtistPosts([]);
    fetch(`/api/artists/posts/${currentArtist}`)
      .then((res) => res.json())
      .then((data) => {
        setCurrentArtistPosts(data.data);
        console.log(data.data);
      });
  }, [currentArtist]);

  return (
    <div className="">
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-800 hover:underline z-50 invisible sm:visible">
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
          />
        )}

        <button
          onClick={(e) => {
            setVideoOpen(!videoOpen);
          }}
        ></button>
      </div>

      <Pagination
        setSearchTerm={setSearchArtists}
        searchTerm={searchArtists}
        offset={artistsOffset}
        setOffset={setArtistsOffset}
        list={artists}
        pagination={pagination}
      />

      <div className="flex flex-row flex-wrap gap-1 justify-center mb-1">
        {artists
          .filter((artist) => {
            return artist.name.includes(searchArtists.toLowerCase().replace(' ', '_'));
          })
          .slice(artistsOffset, artistsOffset + pagination)
          .map((artist, index) => {
            return (
              <div
                className={`${
                  artist.name === currentArtist ? 'bg-green-500' : 'bg-red-600'
                } p-1 text-sm sm:text-base`}
                key={artist.id}
              >
                <button
                  onClick={(e) => {
                    setCurrentArtist(artist.name);
                  }}
                >
                  {artist.name.replaceAll('_', ' ')}
                </button>
              </div>
            );
          })}
      </div>

      <div className="flex flex-col gap-1">
        {currentArtistPosts.map(([series, posts_from_series], i) => (
          <ArtistsCard
            setVideoOpen={setVideoOpen}
            setCurrentVideo={setCurrentVideo}
            key={i}
            series={series}
            posts_from_series={posts_from_series}
          />
        ))}
      </div>
    </div>
  );
};

export default Artists;
