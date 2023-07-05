'use client';

import { useEffect, useState } from 'react';
import Modal from './Modal';

const Artists = ({ current }) => {
  const [artists, setArtists] = useState([]);
  const [searchArtists, setSearchArtists] = useState(current ? current : '');
  const [currentArtist, setCurrentArtist] = useState(current ? current : '');
  const [currentArtistPosts, setCurrentArtistPosts] = useState([]);

  const [videoOpen, setVideoOpen] = useState(false);
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
      <div>
        {currentVideo?.file_url && (
          <Modal isOpen={videoOpen} setOpen={setVideoOpen} currentVideo={currentVideo} />
        )}

        <button
          onClick={(e) => {
            setVideoOpen(!videoOpen);
          }}
        ></button>
      </div>
      <div className="flex justify-center">
        <input
          placeholder="Search Artists"
          className="text-black p-1 mb-2 text-center"
          onChange={(e) => setSearchArtists(e.target.value)}
        ></input>
      </div>
      <div className="flex flex-row flex-wrap gap-1 justify-center mb-1">
        {artists
          .filter((artist) => {
            return artist.name.includes(searchArtists.toLowerCase().replace(' ', '_'));
          })
          .slice(0, 100)
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
          <div key={i} className="bg-gray-900">
            <div className="bg-violet-600 p-2 text-center text-xl font-semibold sticky z-30 top-0 md:static">
              {console.log(series)}
              {series.split(',').map((s, index) => {
                return (
                  <>
                    <a key={index} target="_blank" href={`/shows/${s}`} className="hover:underline">
                      {series === 'undefined' ? 'Other' : s.replaceAll('_', ' ')}
                    </a>
                    {' - '}
                  </>
                );
              })}
              {posts_from_series.length} posts
            </div>
            <div className="flex flex-row flex-wrap  justify-center ">
              {posts_from_series.map((post, index) => {
                return (
                  <div key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/6 2xl:basis-auto">
                    <div className="group w-full h-full z-10">
                      <button
                        className=""
                        onClick={(e) => {
                          setVideoOpen(true);
                          setCurrentVideo(post);
                        }}
                      >
                        <div className=" h-full w-full relative inline text-blue-300 text-2xl flex text-center justify-center align-middle content-center break-all">
                          <p className="absolute flex h-full items-center invisible group-hover:visible ">
                            {post.source === '' ? 'No Source' : `Source: ${post.source}`}
                          </p>
                          <img className="group-hover:opacity-20" src={post.preview_url}></img>
                        </div>
                      </button>
                    </div>
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

export default Artists;
