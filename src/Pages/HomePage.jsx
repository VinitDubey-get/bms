// src/pages/HomePage.jsx
import React from 'react';
import Navbar from '../Components/Navbar';
import HeroSection from '../Components/HeroSection';
import WhyChoose from '../Components/WhyChoose';
import NewsAnnouncements from '../Components/News&Announcement';
import CTA from '../Components/CTA';
import Carausel from '../Components/Carausel';
import Estabilier from '../Components/Eastabiler';
import LandingFooter from'../Components/LandingFooter';
import './HomePage.css';



const HomePage = () => {
  return (
    <>
      <Navbar />
         <div style={{ paddingTop: '5rem' }}></div>
      <HeroSection />
      <WhyChoose/>
      <NewsAnnouncements />
      <CTA/>
      <Carausel/>
      <Estabilier />  
      <LandingFooter/>
    </>
  );
};

export default HomePage;
