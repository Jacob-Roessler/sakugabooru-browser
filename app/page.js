'use client';
import { useState } from 'react';
import Artists from '@/components/Artists';
import Shows from '@/components/Shows';

export default function Home() {
  const [viewMode, setViewMode] = useState('artists');
  return (
    <main className="flex min-h-screen flex-col items-center pt-2 md:px-24">
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-row gap-1">
          <button
            className={`p-1 bg-yellow-500 text-black hover:scale-110 ${
              viewMode === 'artists' && 'scale-110 shadow-lg shadow-yellow-500/50 '
            }`}
            onClick={(e) => {
              setViewMode('artists');
            }}
          >
            Artists
          </button>
          <button
            className={`p-1 bg-violet-700 hover:scale-110 ${
              viewMode === 'series' && 'scale-110 shadow-lg shadow-violet-700/50'
            }`}
            onClick={(e) => {
              setViewMode('series');
            }}
          >
            Series
          </button>
        </div>
      </div>
      {viewMode === 'artists' ? <Artists /> : <Shows />}
    </main>
  );
}
