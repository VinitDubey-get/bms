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

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>Welcome To Bihar Mathematical Society</h1>
          <div className="subhead">
            <img src="/assets/logo.png" alt="check" className="icon-check" />
            Founded in - 1958 in Bhagalpur, Bihar 
          </div>
          <div className="cta-buttons">
            <a href="#how-it-works" className="btn btn-primary">Get Started</a>
          <button className="btn btn-secondary" onClick={handleJoinClick}>Show More</button>
          </div>
        </div>
        <div className="hero-images">
          <Lottie
            path="/assets/society-animation.json" 
            loop
            autoplay
            className="student-animation"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
