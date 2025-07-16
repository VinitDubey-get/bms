// src/pages/HomePage.jsx
import React from 'react';
import Navbar from '../Components/Navbar';
import JournalSection from '../Components/Journal';




const HomePage = () => {
  return (
    <>
      <Navbar /> 
        <div style={{ paddingTop: '5rem' }}></div>
      <JournalSection/>

        <footer className='app-footer'>
        © 2025 Copyright BMS , All rights reserved.
      </footer>
    </>
  );
};

export default HomePage;
