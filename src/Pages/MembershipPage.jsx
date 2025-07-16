// src/pages/HomePage.jsx
import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import ShowMembers from '../Components/ShowMembers';
import MembershipPrices from '../Components/MembershipPrices';  
import './HomePage.css';

const MembershipPage = () => {
  const [currentView, setCurrentView] = useState('purchase'); // 'members' or 'purchase'

  return (
    <>
      <Navbar /> 
      <div style={{ paddingTop: '5rem' }}></div>
      
      {/* Navigation buttons */}
      <div style={{ padding: '1rem', textAlign: 'center', marginBottom: '2rem' }}>
       
        <button 
          onClick={() => setCurrentView('purchase')}
          style={{
            padding: '0.8rem 1.5rem',
            margin: '0 0.5rem',
            backgroundColor: currentView === 'purchase' ? '#667eea' : '#f0f0f0',
            color: currentView === 'purchase' ? 'white' : '#333',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Purchase Membership
        </button>
         <button 
          onClick={() => setCurrentView('members')}
          style={{
            padding: '0.8rem 1.5rem',
            margin: '0 0.5rem',
            backgroundColor: currentView === 'members' ? '#667eea' : '#f0f0f0',
            color: currentView === 'members' ? 'white' : '#333',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          View Members
        </button>
      </div>

      {/* Conditional rendering */}
      {currentView === 'members' ? <ShowMembers /> : <MembershipPrices />}
      
       <div style={{ paddingTop: '5rem' }}></div>
      <footer className='app-footer'>
        © 2025 Copyright BMS , All rights reserved.
      </footer>
    </>
  );
};

export default MembershipPage;