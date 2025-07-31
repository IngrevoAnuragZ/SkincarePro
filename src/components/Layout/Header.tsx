import React, { useState, useEffect } from 'react';
import { Menu, X, User, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../common/Logo';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ transparent = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Skin Assessment', path: '/assessment' },
    { name: 'Ingredient Analysis', path: '/ingredients' },
    { name: 'Routine Builder', path: '/routine' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent && !scrolled 
          ? 'bg-transparent text-white' 
          : 'bg-white text-neutral-800 shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo height={40} className={transparent && !scrolled ? 'text-white' : 'text-primary-600'} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-1 py-2 text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? transparent && !scrolled
                      ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-white'
                      : 'text-primary-600 font-semibold after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary-500'
                    : transparent && !scrolled
                      ? 'text-white/90 hover:text-white'
                      : 'text-neutral-600 hover:text-primary-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* User Menu & Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* User Dashboard Link */}
                <Link
                  to="/dashboard"
                  className={`hidden sm:flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    transparent && !scrolled 
                      ? 'text-white/90 hover:text-white hover:bg-white/10' 
                      : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <User size={18} />
                  <span>{profile?.full_name?.split(' ')[0] || 'Dashboard'}</span>
                </Link>

                {/* Sign Out Button */}
                <button
                  onClick={handleSignOut}
                  className={`hidden sm:block text-sm font-medium ${
                    transparent && !scrolled ? 'text-white/90 hover:text-white' : 'text-neutral-600 hover:text-primary-600'
                  }`}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                {/* Sign In Link */}
                <Link
                  to="/login"
                  className={`hidden sm:flex items-center space-x-1 text-sm font-medium ${
                    transparent && !scrolled ? 'text-white/90 hover:text-white' : 'text-neutral-600 hover:text-primary-600'
                  }`}
                >
                  <User size={18} />
                  <span>Sign In</span>
                </Link>
                
                {/* Sign Up Button */}
                <Link
                  to="/signup"
                  className={`hidden sm:block btn ${
                    transparent && !scrolled ? 'bg-white text-primary-600 hover:bg-neutral-100' : 'btn-primary'
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
            
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X size={24} className={transparent && !scrolled ? 'text-white' : 'text-neutral-800'} />
              ) : (
                <Menu size={24} className={transparent && !scrolled ? 'text-white' : 'text-neutral-800'} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <Logo height={40} className="text-primary-600" />
            <button className="focus:outline-none" onClick={toggleMenu}>
              <X size={24} className="text-neutral-800" />
            </button>
          </div>
          
          <nav className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`py-2 text-lg font-medium ${
                  isActive(link.path) ? 'text-primary-600 font-semibold' : 'text-neutral-600'
                }`}
                onClick={toggleMenu}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto p-4 border-t">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 py-2 text-lg font-medium text-neutral-600"
                  onClick={toggleMenu}
                >
                  <User size={20} />
                  <span>Dashboard</span>
                </Link>
                
                <button
                  onClick={handleSignOut}
                  className="w-full text-left py-2 text-lg font-medium text-neutral-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 py-2 text-lg font-medium text-neutral-600"
                  onClick={toggleMenu}
                >
                  <User size={20} />
                  <span>Sign In</span>
                </Link>
                
                <Link
                  to="/signup"
                  className="btn btn-primary w-full mt-4"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;