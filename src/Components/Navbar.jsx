import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Fixed Navbar */}
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : 'navbar-default'}`}>
        <div className="navbar-container">
          <div className="navbar-content">
            {/* Logo */}
            {/* Logo */}
            <div className="logo-container">
              <img src="/assets/logo.png" alt="BMS Logo" className="logo-image" />
            </div>


            {/* Desktop Navigation Links */}
            <div className="desktop-nav">
              {['/', '/society', '/membership', '/journals', '/gallery', '/council', '/awards', '/donation', '/contact'].map((path, index) => {
                const labels = ['Home', 'Society', 'Membership', 'Journals', 'Gallery', 'Council', 'Awards & Prizes', 'Donation', 'Contact us'];
                return (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                  >
                    {labels[index]}
                  </NavLink>
                );
              })}
            </div>

            {/* Sign In Button - Desktop */}
            <div className="desktop-signin">
              <button className="signin-button">Sign In</button>
            </div>

            {/* Mobile menu button */}
            <div className="mobile-menu-button">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="menu-toggle"
                aria-label="Toggle menu"
              >
                <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`mobile-nav ${mobileMenuOpen ? 'mobile-nav-open' : 'mobile-nav-closed'} ${scrolled ? 'mobile-nav-scrolled' : 'mobile-nav-default'}`}>
          <div className="mobile-nav-content">
            {['/', '/society', '/membership', '/publications', '/gallery', '/council', '/awards', '/donation', '/contact'].map((path, index) => {
              const labels = ['Home', 'Society', 'Membership', 'Journals', 'Gallery', 'Council', 'Awards & Prizes', 'Donation', 'Contact us'];
              return (
                <NavLink
                  key={path}
                  to={path}
                  onClick={handleMobileLinkClick}
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}
                >
                  {labels[index]}
                </NavLink>
              );
            })}

            {/* Mobile Sign In Button */}
            <div className="mobile-signin">
              <button className="signin-button mobile-signin-button">Sign In</button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
