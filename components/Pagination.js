import React from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

const Pagination = ({ searchTerm, setSearchTerm, offset, setOffset, list, pagination }) => {
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
        placeholder={searchTerm ? `${searchTerm}` : `Search Artists`}
        className="text-black p-2 text-center"
        onChange={(e) => {
          setOffset(0);
          setSearchTerm(e.target.value);
        }}
      ></input>
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
