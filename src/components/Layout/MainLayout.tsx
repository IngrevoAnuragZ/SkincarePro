import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  transparentHeader?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ transparentHeader = false }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header transparent={transparentHeader} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;