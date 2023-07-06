import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { RxCross2 } from 'react-icons/rx';

const Pagination = ({
  searchTerm,
  setSearchTerm,
  offset,
  setOffset,
  list,
  pagination,
  placeholder,
}) => {
  let end;
  if (searchTerm === '') {
    end = list.length;
  } else {
    end = list.filter((artist) => {
      return artist.name.includes(searchTerm.toLowerCase().replace(' ', '_'));
    }).length;
  }

  let reachedEnd = end - pagination > offset;

  return (
    <div className="flex flex-row content-center justify-center mb-2">
      <button
        className={`bg-slate-800 px-2  ${
          offset === 0 ? 'bg-black text-black cursor-default' : 'hover:scale-105'
        }`}
        onClick={(e) => {
          setOffset(0);
        }}
      >
        <RiArrowLeftSLine />
        <RiArrowLeftSLine />
      </button>
      <button
        className={`bg-slate-800 px-2  ${
          offset === 0 ? 'bg-black text-black  cursor-default' : 'hover:scale-105'
        }`}
        onClick={(e) => {
          setOffset(Math.max(0, offset - pagination));
        }}
      >
        <RiArrowLeftSLine />
      </button>
      <input
        placeholder={`Search ${placeholder}...`}
        className="text-black p-2 text-center focus:outline-none focus:shadow-md focus:shadow-gray-500"
        onChange={(e) => {
          setOffset(0);
          setSearchTerm(e.target.value);
        }}
        value={searchTerm ? searchTerm : ''}
      ></input>
      <button
        className={`text-black bg-white z-10 relative ${searchTerm ? 'visible' : 'invisible'}`}
        onClick={(e) => {
          if (searchTerm) {
            setOffset(0);
          }
          setSearchTerm('');
        }}
      >
        <RxCross2 className="absolute right-2 -translate-y-1/2" />
      </button>
      <button
        className={`bg-slate-800 px-2 ${
          reachedEnd ? 'hover:scale-105' : 'bg-black text-black  cursor-default'
        }`}
        onClick={(e) => {
          setOffset(Math.min(end - pagination, offset + pagination));
        }}
      >
        <RiArrowRightSLine />
      </button>
      <button
        className={`bg-slate-800 px-2  ${
          reachedEnd ? 'hover:scale-105' : 'bg-black text-black  cursor-default'
        }`}
        onClick={(e) => {
          setOffset(end - pagination);
        }}
      >
        <RiArrowRightSLine />
        <RiArrowRightSLine />
      </button>
    </div>
  );
};

export default Pagination;
