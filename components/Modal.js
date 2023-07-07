import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { BiSkipPrevious, BiSkipNext } from 'react-icons/bi';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';

import Link from 'next/link';

export default function Modal({ isOpen, setOpen, currentVideo, goFullscreen, setCurrentVideo }) {
  const cancelButtonRef = useRef(null);
  const playerRef = useRef(null);

  const [showControls, setShowControls] = useState(false);

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
          <div className="flex min-h-full  justify-center text-center items-center ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-900 shadow-xl transition-all sm:w-full sm:max-w-screen max-w-7xl">
                <div className="bg-gray-900">
                  <div className="">
                    <div className="">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-white flex flex-col"
                      >
                        {currentVideo.source.includes('http') ? (
                          <Link
                            target="_blank"
                            href={currentVideo.source.split('Source: ')[1]}
                            className="text-blue-200 hover:underline"
                          >
                            {currentVideo.source
                              .split('Source: ')[1]
                              .replace(/^https?:\/\//, '')
                              .replace(/^www\./, '')
                              .replace(/\..*/, '')}
                          </Link>
                        ) : (
                          `${currentVideo.source === '' ? 'Source: None' : currentVideo.source}`
                        )}
                      </Dialog.Title>
                      <div className="mt-2 flex flex-row justify-center ">
                        {currentVideo.file_ext !== 'mp4' && currentVideo.file_ext !== 'webm' ? (
                          <div className="relative aspect-auto">
                            <img
                              src={currentVideo.file_url}
                              alt="image"
                              className="w-full h-full"
                            ></img>
                          </div>
                        ) : (
                          <div className="relative aspect-auto w-full h-full">
                            <ReactPlayer
                              ref={playerRef}
                              playsinline={true}
                              width={'100%'}
                              height={'100%'}
                              playing={true}
                              loop={true}
                              controls={window.screen.width >= 768 || showControls}
                              url={currentVideo.file_url}
                              className=" object-fill"
                              onPlay={handlePlay}
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-row gap-1 sm:gap-4 px-2 sm:px-12 sm:py-2">
                        <span className="flex flex-col flex-wrap basis-1/2 text-end">
                          {currentVideo.series.map((s, index) => {
                            return (
                              <Link
                                key={index}
                                href={`/shows/${s}`}
                                className={`hover:underline  text-violet-500 ${
                                  currentVideo?.selected_series === s ? 'text-green-500' : ''
                                }`}
                              >
                                {s.replaceAll('_', ' ')}
                              </Link>
                            );
                          })}{' '}
                        </span>
                        <score>Score: {currentVideo.score}</score>
                        <span
                          className={`flex flex-wrap break-all sm:break-normal gap-1 sm:gap-2 basis-1/2 ${
                            currentVideo.artists.length > 3 ? 'text-xs' : ''
                          }`}
                        >
                          {Object.hasOwn(currentVideo, 'artists') &&
                            currentVideo.artists.map((artist, index) => {
                              return (
                                <Link
                                  key={index}
                                  href={`/artists/${artist}`}
                                  className="hover:underline text-yellow-500 odd:text-yellow-400"
                                >
                                  {artist.replaceAll('_', ' ')}
                                </Link>
                              );
                            })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900 flex flex-row justify-center">
                  <button
                    className="bg-blue-500 text-sm "
                    onClick={(e) => {
                      navigator.clipboard.writeText(currentVideo.file_url);
                    }}
                  >
                    Copy to clipboard
                  </button>
                  <Link
                    className="bg-blue-500 text-sm flex items-center"
                    href={`https://www.sakugabooru.com/post/show/${currentVideo.id}`}
                    target="_blank"
                  >
                    Booru Page
                  </Link>
                  <button
                    className="bg-blue-500 text-sm sm:invisible"
                    onClick={(e) => {
                      setShowControls(!showControls);
                    }}
                  >
                    {`${showControls ? 'Hide' : 'Show'}`} Controls
                  </button>

                  <div className="basis-[100%] flex justify-end">
                    <button
                      type="button"
                      className=" float-left bg-red-600 text-sm p-3 font-semibold text-white shadow-sm hover:bg-red-500"
                      onClick={() => setOpen(false)}
                    >
                      Close
                    </button>
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
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
