"use client"
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  username?: string;
}

export default function Layout({ children, username = 'Ashish-AR21SMok' }: LayoutProps) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div >
        <main className="p-4">
          {children}
        </main>
        {/* <Footer /> */}
      </div>
    </div>
  );
}