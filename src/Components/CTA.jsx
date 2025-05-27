// components/Community.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import navigation hook
import './CTA.css'; 

const Community = () => {
  const navigate = useNavigate(); // ✅ Initialize navigation

  const handleJoinClick = () => {
    navigate('/membership'); // ✅ Navigate to membership page
  };

  return (
    <section className="community">
      <div className="container">
        <div className="community-content">
          <h2>Join Our Mathematical Society</h2>
          <p>"Connect with mathematicians, researchers, and scholars across Bihar and beyond.....</p>
          <h3>Become a Member Now</h3>
          <button className="btn" onClick={handleJoinClick}>Join Now</button>
        </div>
        <div className="community-image">
          <img src="/assets/logo.png" alt="Community" className="feature-image" />
        </div>
      </div>
    </section>
  );
};

export default Community;
