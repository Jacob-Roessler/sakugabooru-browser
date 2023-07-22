import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Sakugabooru Browser',
  description: 'NextJs app that lets you view all posts of an artist or series from sakugabooru',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="text-xl sm:text-3xl pb-2 text-center py-12">
          <Link href="/">Booru Browser</Link>
        </div>

        {children}
      </body>
    </html>
  );
}
