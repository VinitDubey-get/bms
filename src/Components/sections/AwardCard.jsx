import React, { useState } from 'react';
import './AwardCard.css';

const AwardCard = ({ image, name, prize, onDelete, isDeleting }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent card click events
    onDelete();
  };

  return (
    <div className={`award-card ${!imageLoaded ? 'loading' : ''} ${isDeleting ? 'deleting' : ''}`}>
      {/* Award Trophy Icon */}
      <div className="award-icon">
        🏆
      </div>
      
      {/* Delete Button */}
      <button 
        className="delete-button" 
        onClick={handleDeleteClick}
        disabled={isDeleting}
        title="Delete Award"
      >
        {isDeleting ? '⏳' : '🗑️'}
      </button>
      
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
          <div className='prize-name'> {prize}</div>
         
        </div>
      </div>

      {/* Deleting Overlay */}
      {isDeleting && (
        <div className="deleting-overlay">
          <div className="deleting-spinner">🔄</div>
          <p>Deleting...</p>
        </div>
      )}
    </div>
  );
};

export default AwardCard;