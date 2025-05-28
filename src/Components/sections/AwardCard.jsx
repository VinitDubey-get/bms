import React, { useState } from 'react';
import './AwardCard.css';

const AwardCard = ({ image, name, prize }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div className={`award-card ${!imageLoaded ? 'loading' : ''}`}>
      {/* Award Trophy Icon */}
      <div className="award-icon">
        🏆
      </div>
      
      {/* Image Section */}
      <div style={{ position: 'relative' }}>
        {!imageError ? (
          <img 
            src={image} 
            alt={name} 
            className="award-image"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div 
            className="award-image" 
            style={{
              background: 'linear-gradient(135deg, #f7fafc, #edf2f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              color: '#cbd5e0'
            }}
          >
            🖼️
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="image-overlay">
          <div className="overlay-icon">✨</div>
        </div>
      </div>
      
      {/* Card Content */}
      <div className="award-info">
        <h4>{name}</h4>
        <p>{prize}</p>
        <div className="prize-badge">
          {prize}
        </div>
      </div>
    </div>
  );
};

export default AwardCard;