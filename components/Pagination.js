import { useState } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { RxCross2 } from 'react-icons/rx';
import debounce from 'lodash.debounce';

const Pagination = ({
  searchTerm,
  setSearchTerm,
  offset,
  setOffset,
  list,
  pagination,
  setPagination,
  placeholder,
}) => {
  const [sliderValue, setSliderValue] = useState(0);
  let end;

  if (searchTerm === '') {
    end = list.length;
  } else {
    end = list.filter((artist) => {
      return artist.name.includes(searchTerm.toLowerCase().replace(' ', '_'));
    }).length;
  }
  let setOffsetDebounced = debounce(setOffset, 50);

  return (
    <div className="flex flex-row flex-wrap content-center justify-center mb-2">
      <input
        type="text"
        placeholder={`Search ${placeholder}...`}
        className="input text-[16px]"
        onChange={(e) => {
          setOffset(0);
          setSearchTerm(e.target.value);
        }}
        value={searchTerm ? searchTerm : ''}
      ></input>
      <button
        className={`text-white z-10 relative ${searchTerm ? 'visible' : 'invisible'}`}
        onClick={(e) => {
          if (searchTerm) {
            setOffset(0);
          }
          setSearchTerm('');
        }}
      >
        <RxCross2 className="absolute right-2 -translate-y-1/2  scale-125 hover:scale-150" />
      </button>
      <select
        className="input w-[80px] ml-1"
        value={pagination}
        onChange={(e) => {
          setPagination(parseInt(e.target.value ? Math.min(e.target.value, 200) : 50));
        }}
      >
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="75">75</option>
        <option value="100">100</option>
        <option value="200">200</option>
      </select>

      <div className={`basis-full text-center ${pagination >= end && 'invisible'} `}>
        <button onClick={() => setOffset(Math.max(0, offset - pagination))}>
          <RiArrowLeftSLine className="relative -translate-y-1" />
        </button>
        <input
          type="range"
          min={0}
          max={end - (end % pagination)}
          value={offset}
          disabled={pagination >= end}
          className={`range max-w-sm mt-2
          ${placeholder === 'Artists' ? 'range-warning' : 'range-primary'}
          
          `}
          step={pagination}
          onChange={(e) => {
            setSliderValue(e.target.value);
            setOffsetDebounced(parseInt(e.target.value));
          }}
        />
        <button
          onClick={() =>
            setOffset(offset + pagination <= end ? offset + pagination : end - (end % pagination))
          }
        >
          <RiArrowRightSLine className="relative -translate-y-1" />
        </button>
      </div>
      {end <= 0 ? (
        <p className="">No Results Found</p>
      ) : (
        <p>
          {offset}-{offset + pagination > end ? end : offset + pagination} of {end}
        </p>
      )}
    </div>
  );
};

export default Pagination;
