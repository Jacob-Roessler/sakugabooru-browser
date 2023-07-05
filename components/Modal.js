import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';

export default function Example({ isOpen, setOpen, currentVideo, goFullscreen }) {
  const cancelButtonRef = useRef(null);
  const playerRef = useRef(null);

  const handlePlay = () => {
    const player = playerRef.current;

    if (player && goFullscreen) {
      console.log(player.getInternalPlayer());
      let entered = screenfull.request(player.getInternalPlayer());
      if (entered) {
        return;
      }
      try {
        let videoElement = player.getInternalPlayer();
        if (videoElement.requestFullscreen) {
          videoElement.requestFullscreen();
        } else if (videoElement.mozRequestFullScreen) {
          // For Firefox
          videoElement.mozRequestFullScreen();
        } else if (videoElement.webkitRequestFullscreen) {
          // For Safari and Chrome
          videoElement.webkitRequestFullscreen();
        } else if (videoElement.msRequestFullscreen) {
          // For IE/Edge
          videoElement.msRequestFullscreen();
        }
      } catch (e) {}
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-screen max-w-6xl">
                <div className="bg-gray-900 pb-4 pt-5 sm:p-6 sm:pb-4 ">
                  <div className="">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
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
                      <div className="mt-2 flex flex-row justify-center">
                        {currentVideo.file_ext !== 'mp4' && currentVideo.file_ext !== 'webm' ? (
                          <img src={currentVideo.file_url} alt="image"></img>
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
                      <div className="flex flex-row sm:flex-col justify-center items-center gap-1">
                        <span>
                          {Array.isArray(currentVideo.series)
                            ? currentVideo.series.join(' - ').replaceAll('_', ' ')
                            : currentVideo.series.replaceAll('_', ' ')}{' '}
                          - {currentVideo.source.replace('#', 'Episode ')}
                        </span>
                        <span className="flex gap-1">
                          {Object.hasOwn(currentVideo, 'artists') &&
                            currentVideo.artists.map((artist, index) => {
                              return (
                                <a
                                  key={index}
                                  target="_blank"
                                  href={`/artists/${artist}`}
                                  className="hover:underline text-yellow-500"
                                >
                                  {artist.replaceAll('_', ' ')}
                                </a>
                              );
                            })}
                        </span>
                        <a
                          target="_blank"
                          href={`https://www.sakugabooru.com/post/show/${currentVideo.id}`}
                          className="hover:underline text-blue-300"
                        >
                          booru page
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
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
