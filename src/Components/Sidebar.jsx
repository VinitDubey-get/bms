import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const sections = [
  'Awards & Prizes', 'Members', 'Gallery', 'Journals', 'Councils', 'Donors', 'Notices'
];

const Sidebar = ({ activeSection, setActiveSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth <= 768);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Click outside to close mobile menu
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
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <>
      {/* Hamburger menu for mobile */}
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
        <div className="sidebar-header">
          <h1>BMS</h1>
        </div>

        <nav className="sidebar-nav">
          {sections.map(section => (
            <button 
              key={section} 
              className={`sidebar-button ${activeSection === section ? 'active' : ''}`}
              onClick={() => handleSectionClick(section)}
            >
              {section}
            </button>
          ))}
        </nav>

        {/* Logout Button - pinned to bottom */}
        <div className="sidebar-logout-container">
          <button 
            className="sidebar-button logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
