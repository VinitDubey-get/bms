// src/pages/HomePage.jsx
import React from 'react';
import Navbar from '../Components/Navbar';
import GallerySection from '../Components/GallerySection';
import './HomePage.css';



const HomePage = () => {
  return (
    <>
      <Navbar /> 
        <div style={{ paddingTop: '5rem' }}></div>
      <GallerySection/>

        <footer className='app-footer'>
        @ 2025 BMS. All rights reserved.
      </footer>
    </>
  );
};

export default HomePage;
