'use client';

import { useEffect, useState } from 'react';
import Modal from './Modal';

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [searchArtists, setSearchArtists] = useState('');
  const [currentArtist, setCurrentArtist] = useState('');
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
    <div className="container">
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
      <div className="text-center">
        <input
          placeholder="Search Artists"
          className="text-black p-1 mb-2"
          onChange={(e) => setSearchArtists(e.target.value)}
        ></input>
      </div>
      <div className="flex flex-row flex-wrap gap-1 justify-center">
        {artists
          .filter((artist) => {
            return artist.name.includes(searchArtists.toLowerCase().replace(' ', '_'));
          })
          .slice(0, 100)
          .map((artist, index) => {
            return (
              <div className=" bg-red-600 p-1" key={artist.id}>
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

export default Artists;
