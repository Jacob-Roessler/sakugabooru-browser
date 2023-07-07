import { useState } from 'react';
import Link from 'next/link';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { useCollapse } from 'react-collapsed';

const ShowsCard = ({
  artist,
  posts_from_artist,
  setVideoOpen,
  setCurrentVideo,
  sortByEpisode,
  currentShow,
}) => {
  const [isExpanded, setExpanded] = useState(artist === 'artist_unknown' ? false : true);
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

  return (
    <div className="sm:px-8 text-sm md:text-xl">
      <div className="bg-yellow-500 p-2 text-left font-semibold sticky z-30 top-0 md:static flex-row ">
        <button
          {...getToggleProps({
            onClick: () => setExpanded((prevExpanded) => !prevExpanded),
          })}
          className="w-full"
        >
          <span className="float-left">{isExpanded ? <AiOutlineMinus /> : <AiOutlinePlus />}</span>
          <span className="float-right">{posts_from_artist.length} posts</span>

          <span className="flex flex-row  justify-center">
            <Link
              href={!sortByEpisode ? `/artists/${artist}` : ''}
              className={`${!sortByEpisode && 'hover:underline'} z-50`}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {artist === 'undefined' ? 'Other' : artist.replaceAll('_', ' ')}
            </Link>
          </span>
        </button>
      </div>

      <section {...getCollapseProps()}>
        <div className="bg-gray-900">
          <div className="flex flex-row flex-wrap justify-center items-center">
            {posts_from_artist.map((post, index) => {
              return (
                <div
                  key={`${post.id}: ${index}`}
                  className="group basis-1/2 sm:basis-1/3 md:basis-1/6 2xl:basis-auto"
                >
                  <button
                    onClick={(e) => {
                      setVideoOpen(true);
                      setCurrentVideo({ ...post, other_posts: posts_from_artist, index: index });
                    }}
                  >
                    <div className=" h-full w-full relative inline text-blue-300 text-2xl flex text-center justify-center align-middle content-center ">
                      <p className="absolute flex flex-col h-full items-center justify-center invisible group-hover:visible text-xs px-2">
                        <>
                          <span className="text-yellow-500">{post.artists.join(' - ')}</span>
                          <span className="text-violet-500">
                            {post.series.filter((s) => !s.includes(currentShow)).join(' ')}
                          </span>{' '}
                          <span className="text-white">
                            {post.source !== '' ? post.source : 'Source: None'}
                          </span>
                        </>
                      </p>
                      <img className="group-hover:opacity-20" src={post.preview_url}></img>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShowsCard;
