import { useState } from 'react';
import Link from 'next/link';
import { useCollapse } from 'react-collapsed';

const ShowsCard = ({ series, posts_from_series, setVideoOpen, setCurrentVideo, sortByEpisode }) => {
  const [isExpanded, setExpanded] = useState(series === 'artist_unknown' ? false : true);
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

  return (
    <div className="text-sm md:text-xl">
      <div className="bg-yellow-500 p-2 text-black text-center font-semibold flex flex-col sticky z-30 top-0 md:static">
        <button
          {...getToggleProps({
            onClick: () => setExpanded((prevExpanded) => !prevExpanded),
          })}
          className="w-full"
        >
          <span className="float-left">{isExpanded ? '-' : '+'}</span>
          <Link
            href={!sortByEpisode ? `/artists/${series}` : ''}
            className={`${!sortByEpisode && 'hover:underline'} `}
          >
            {series === 'undefined' ? 'Other' : series.replaceAll('_', ' ')} -{' '}
            {posts_from_series.length} posts
          </Link>
        </button>
      </div>

      <section {...getCollapseProps()}>
        <div className="bg-gray-900">
          <div className="flex flex-row flex-wrap justify-center items-center">
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
                    <div className=" h-full w-full relative inline text-blue-300 text-2xl flex text-center justify-center align-middle content-center ">
                      <p className="absolute flex h-full items-center invisible group-hover:visible break-words">
                        {sortByEpisode
                          ? `By ${post.artists.join(' ')} ${
                              post.source.includes('Source') ? post.source : ''
                            }`
                          : `${post.source.trim() === 'Source:' ? 'Source: None' : post.source}`}
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
