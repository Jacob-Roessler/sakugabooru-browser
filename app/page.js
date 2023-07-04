'use client';
import { useState } from 'react';
import Artists from '@/components/Artists';
import Shows from '@/components/Shows';

export default function Home() {
  const [viewMode, setViewMode] = useState('artists');
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="text-xl sm:text-3xl mb-2">Booru Browser</div>
      <div className="flex flex-col justify-center items-center">
        Browse by
        <div className="flex flex-row gap-1">
          <button
            className={`p-1 bg-yellow-500 hover:scale-110 ${
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
