// HeroSection.jsx
import React from 'react';
import './HeroSection.css';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom'; 

const HeroSection = () => {

   const navigate = useNavigate(); // ✅ Initialize navigation

  const handleJoinClick = () => {
    navigate('/society'); // ✅ Navigate to society page
  };
   const handleGetClick = () => {
    navigate('/membership'); // ✅ Navigate to society page
  };
 
  return (
    <section className="hero-banner">
      <div className="hero-container">
        <div className="hero-text-content">
          <h1>Welcome To Bihar Mathematical Society</h1>
          <div className="hero-text-subtitle">
            <img src="/assets/logo.png" alt="check" className="hero-icon" />
            Founded in - 1958 in Bhagalpur, Bihar 
          </div>
          <div className="hero-buttons">
             <button className="hero-btn hero-btn-primary" onClick={handleGetClick}>Get Started</button>
          <button className="hero-btn hero-btn-secondary" onClick={handleJoinClick}>Show More</button>
          </div>
        </div>
        <div className="hero-animation-container">
          <Lottie
            path="/assets/society-animation.json" 
            loop
            autoplay
            className="hero-animation"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;