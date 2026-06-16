import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-navy-900 text-[#0F172A] selection:bg-blue-500/20 selection:text-blue-800">
      <Navbar />
      <main className="pt-20 h-screen overflow-hidden flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
