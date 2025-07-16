// src/pages/HomePage.jsx
import React from 'react';
import Navbar from '../Components/Navbar';
import CouncilSection from '../Components/Council';




const HomePage = () => {
  return (
    <>
      <Navbar /> 
        <div style={{ paddingTop: '5rem' }}></div>
    
      <CouncilSection/>

        <footer className='app-footer'>
        © 2025 Copyright BMS , All rights reserved.
      </footer>
    </>
  );
};

export default HomePage;
