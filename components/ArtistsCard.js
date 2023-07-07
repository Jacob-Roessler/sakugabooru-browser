import { useState } from 'react';
import { useCollapse } from 'react-collapsed';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import Link from 'next/link';

const ArtistsCard = ({
  series,
  posts_from_series,
  setVideoOpen,
  setCurrentVideo,
  currentArtist,
}) => {
  const [isExpanded, setExpanded] = useState(true);
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

  return (
    <div className="sm:px-8 text-sm md:text-xl">
      <div className="bg-violet-600 p-2 text-left font-semibold sticky z-30 top-0 md:static ">
        <button
          {...getToggleProps({
            onClick: () => setExpanded((prevExpanded) => !prevExpanded),
          })}
          className="w-full"
        >
          <span className="float-left mr-1">
            {isExpanded ? <AiOutlineMinus /> : <AiOutlinePlus />}
          </span>
          <span className="float-right">{posts_from_series.length}</span>

          <span className="flex flex-row gap-2 ">
            {series.split(',').map((s, index) => {
              return (
                <>
                  <Link
                    key={s + index}
                    href={`/shows/${s.replaceAll('/', '$')}`}
                    className="hover:underline z-50 w-fit"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {series === 'undefined' ? 'Other' : s.replaceAll('_', ' ')}
                  </Link>
                </>
              );
            })}
          </span>
        </button>
      </div>

      <section {...getCollapseProps()}>
        <div className="bg-gray-900">
          <div className="flex flex-row flex-wrap  justify-center items-center ">
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

                        setCurrentVideo({ ...post, other_posts: posts_from_series, index: index });
                      }}
                    >
                      <div className=" h-full w-full relative  text-blue-300 text-2xl flex text-center justify-center align-middle content-center">
                        <p className="absolute flex flex-col h-full items-center justify-center invisible group-hover:visible text-xs px-2">
                          <>
                            <span className="text-yellow-500">
                              {post.artists
                                .filter((a) => !a.includes(currentArtist))
                                .join(' ')
                                .replaceAll('_', ' ')}
                            </span>
                            <span className="text-violet-500">
                              {post.series.join(' ').replaceAll('_', ' ')}
                            </span>
                            <span className="text-white">
                              {post.source !== '' ? post.source : 'Source: None'}
                            </span>
                            <span>Score: {post.score}</span>
                          </>
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
