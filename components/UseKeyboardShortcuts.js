import { useEffect, useCallback } from 'react';

const UseKeyboardShortcuts = ({
  setAutoFullscreen,
  autoFullscreen,
  offset,
  setOffset,
  setSearch,
  search,
  pagination,
  setSortByEpisode,
  sortByEpisode,
}) => {
  // handle what happens on key press
  const handleKeyPress = useCallback((event) => {
    console.log(setSortByEpisode);
    let target = event.target || event.srcElement;
    const targetTagName = target.nodeType == 1 ? target.nodeName.toUpperCase() : '';
    if (/INPUT|SELECT|TEXTAREA/.test(targetTagName)) {
      return;
    }

    if (event.key.toLowerCase() === 'f') {
      setAutoFullscreen(!autoFullscreen);
    } else if (event.key === 'ArrowLeft') {
      setOffset(Math.max(0, offset - pagination));
    } else if (event.key === 'ArrowRight') {
      setOffset(offset + pagination);
    } else if (
      event.key.toLowerCase() === 's' ||
      event.key === 'ArrowDown' ||
      event.key === 'ArrowUp'
    ) {
      if (setSortByEpisode !== undefined) {
        setSortByEpisode(!sortByEpisode);
      }
    } else if (event.key === 'Backspace') {
      setSearch('');
    }
  });

  useEffect(() => {
    // attach the event listener
    document.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return <></>;
};

export default UseKeyboardShortcuts;
