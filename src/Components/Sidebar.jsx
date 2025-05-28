import React, { useState, useEffect } from 'react';
import './Sidebar.css';

const sections = [
  'Awards & Prizes', 'Members', 'Gallery', 'Journals', 'Councils', 'Donors', 'Notices', 'Logout'
];

const Sidebar = ({ activeSection, setActiveSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close mobile menu when clicking outside (but not when clicking menu items)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && 
          !event.target.closest('.sidebar') && 
          !event.target.closest('.hamburger-menu')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen, isMobile]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
    // Don't close mobile menu when clicking sections - only close via hamburger icon
  };

  return (
    <>
      {/* Hamburger Menu - Only visible on mobile */}
      {isMobile && (
        <div 
          className={`hamburger-menu ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
        >
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </div>
      )}

      {/* Overlay for mobile */}
      {isMobile && (
        <div 
          className={`sidebar-overlay ${isMobileMenuOpen ? 'show' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isMobile && isMobileMenuOpen ? 'open' : ''}`}>
        <div className='sidebar-header'>
          <h1>BMS</h1>
        </div>

        <nav className='sidebar-nav'>
          {sections.map(section => (
            <button 
              key={section} 
              className={`sidebar-button ${activeSection === section ? 'active' : ''} ${section === 'Logout' ? 'logout' : ''}`}
              onClick={() => handleSectionClick(section)}
            >
              {section}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;