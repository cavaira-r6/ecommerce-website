import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AnimatedBackground from '../common/AnimatedBackground';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
  <div className="min-h-screen flex flex-col bg-transparent text-gray-900 dark:text-white relative">
      {/* Fullsite animated background (non-interactive, behind content) */}
      <AnimatedBackground />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;