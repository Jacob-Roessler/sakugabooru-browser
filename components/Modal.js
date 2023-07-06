import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { BiSkipPrevious, BiSkipNext } from 'react-icons/bi';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';

import Link from 'next/link';

export default function Modal({ isOpen, setOpen, currentVideo, goFullscreen, setCurrentVideo }) {
  const cancelButtonRef = useRef(null);
  const playerRef = useRef(null);

  const handlePlay = () => {
    const player = playerRef.current;

    if (goFullscreen && player) {
      try {
        screenfull.request(player.getInternalPlayer());
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[100]"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto text-xs md:text-base">
          <div className="flex min-h-full items-end justify-center p-4 text-center items-center p-0 max-h-[90vh]">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-900 shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-screen max-w-6xl">
                <div className="bg-gray-900 pb-4 pt-5 sm:p-6 sm:pb-4 ">
                  <div className="">
                    <div className="mt-3 sm:ml-4 sm:mt-0 ">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-white flex flex-col"
                      >
                        <button
                          className="text-sm md:text-base"
                          onClick={(e) => {
                            navigator.clipboard.writeText(currentVideo.file_url);
                          }}
                        >
                          Copy to clipboard
                        </button>
                      </Dialog.Title>
                      <div className="mt-2 flex flex-row justify-center ">
                        <div className="">
                          {currentVideo.file_ext !== 'mp4' && currentVideo.file_ext !== 'webm' ? (
                            <img
                              src={currentVideo.file_url}
                              alt="image"
                              className="w-full max-h-[85vh]"
                            ></img>
                          ) : (
                            <ReactPlayer
                              ref={playerRef}
                              playsinline={true}
                              width={currentVideo.width}
                              height={currentVideo.height}
                              playing={true}
                              loop={true}
                              controls={true}
                              url={currentVideo.file_url}
                              className="w-[100%]"
                              onPlay={handlePlay}
                            />
                          )}
                        </div>
                      </div>

                      <div className="flex flex-row sm:flex-col justify-center items-center gap-1 sm:gap-1">
                        <span className="flex gap-2">
                          {Array.isArray(currentVideo.series)
                            ? currentVideo.series.map((s, index) => {
                                return (
                                  <Link
                                    key={index}
                                    href={`/shows/${s}`}
                                    className="hover:underline text-violet-500"
                                  >
                                    {s.replaceAll('_', ' ')}
                                  </Link>
                                );
                              })
                            : currentVideo.series.replaceAll('_', ' ')}{' '}
                          {currentVideo.source}
                        </span>
                        <span className="flex gap-1 sm:gap-4 justify-between">
                          {Object.hasOwn(currentVideo, 'artists') &&
                            currentVideo.artists.map((artist, index) => {
                              return (
                                <Link
                                  key={index}
                                  href={`/artists/${artist}`}
                                  className="hover:underline text-yellow-500"
                                >
                                  {artist.replaceAll('_', ' ')}
                                </Link>
                              );
                            })}
                        </span>
                        <Link
                          target="_blank"
                          href={`https://www.sakugabooru.com/post/show/${currentVideo.id}`}
                          className="hover:underline text-blue-300"
                        >
                          booru page
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900 px-4 py-3 flex flex-row  sm:px-6 sm:justify-center sm:flex-col">
                  <div className="basis-[50%] flex justify-center ">
                    <button
                      className={` bg-green-600  ${currentVideo.index ? 'visible' : 'invisible'}`}
                      onClick={() => {
                        let i = currentVideo.index;
                        setCurrentVideo({
                          ...currentVideo.other_posts[i - 1],
                          other_posts: currentVideo.other_posts,
                          index: i - 1,
                        });
                      }}
                    >
                      <BiSkipPrevious size={'60px'} />
                    </button>
                    <button
                      className={`bg-green-600  ${
                        currentVideo.index < currentVideo.other_posts.length - 1
                          ? 'visible'
                          : 'invisible'
                      }`}
                      onClick={() => {
                        let i = currentVideo.index;
                        setCurrentVideo({
                          ...currentVideo.other_posts[i + 1],
                          other_posts: currentVideo.other_posts,
                          index: i + 1,
                        });
                      }}
                    >
                      <BiSkipNext size={'60px'} />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="basis-[50%] sm:w-[10%] sm:ml-[90%] p-3  bg-red-600 text-sm font-semibold text-white shadow-sm hover:bg-red-500 "
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
