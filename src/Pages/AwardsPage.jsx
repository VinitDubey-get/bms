// src/pages/HomePage.jsx
import React from 'react';
import Navbar from '../Components/Navbar';
import './HomePage.css';
import './AwardsPage.css';



const AwardsPage = () => {
  return (
    <>
      <Navbar /> 
        <div style={{ paddingTop: '5rem' }}></div>
    
        <h1 className='Disclaimer'>Coming Soon</h1>
         <div style={{ paddingTop: '15rem' }}></div>
        <footer className='app-footer'>
        © 2025 Copyright BMS , All rights reserved.
      </footer>
    </>
  );
};

export default AwardsPage;
