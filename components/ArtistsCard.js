import { useState } from 'react';
import { useCollapse } from 'react-collapsed';

import Link from 'next/link';

const ArtistsCard = ({ series, posts_from_series, setVideoOpen, setCurrentVideo }) => {
  const [isExpanded, setExpanded] = useState(true);
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

  return (
    <div className="text-sm md:text-xl">
      <div className="bg-violet-600 p-2 text-left font-semibold sticky z-30 top-0 md:static flex-row ">
        <button
          {...getToggleProps({
            onClick: () => setExpanded((prevExpanded) => !prevExpanded),
          })}
          className="w-full"
        >
          <span className="float-left">{isExpanded ? '-' : '+'}</span>
          {series.split(',').map((s, index) => {
            return (
              <>
                <Link
                  key={s + index}
                  href={`/shows/${s.replaceAll('/', '$')}`}
                  className="hover:underline"
                >
                  {series === 'undefined' ? 'Other' : s.replaceAll('_', ' ')}
                </Link>
                {' - '}
              </>
            );
          })}
          {posts_from_series.length} posts
        </button>
      </div>

      <section {...getCollapseProps()}>
        <div className="bg-gray-900">
          <div className="flex flex-row flex-wrap  justify-center items-center">
            {posts_from_series.map((post, index) => {
              return (
                <div
                  key={`${post.id}: ${index}`}
                  className="basis-1/2 sm:basis-1/3 md:basis-1/6 2xl:basis-auto"
                >
                  <div className="group w-full h-full z-10">
                    <button
                      className=""
                      onClick={(e) => {
                        setVideoOpen(true);
                        setCurrentVideo(post);
                      }}
                    >
                      <div className=" h-full w-full relative  text-blue-300 text-2xl flex text-center justify-center align-middle content-center break-all">
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
      </section>
    </div>
  );
};

export default ArtistsCard;
