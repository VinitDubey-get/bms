import React, { useState } from 'react';
import './MembershipPrices.css';

const MembershipPrices = () => {
  const [selectedCard, setSelectedCard] = useState(null);

  const membershipTypes = [
    {
      id: 1,
      title: "Life Member (Constituent College Teacher)",
      price: "Rs 4,000/-",
      description: "Full access to all BMS resources and benefits for constituent college teachers",
      features: ["Lifetime membership", "Access to all events", "Research publications", "Networking opportunities"]
    },
    {
      id: 2,
      title: "Life Member (Affiliated College Teacher)",
      price: "Rs 3,000/-",
      description: "Comprehensive membership for affiliated college teachers",
      features: ["Lifetime membership", "Event participation", "Academic resources", "Professional development"]
    },
    {
      id: 3,
      title: "Life Member (Teacher)",
      price: "Rs 2,500/-",
      description: "Essential membership package for teachers",
      features: ["Lifetime access", "Educational resources", "Workshop participation", "Certificate programs"]
    },
    {
      id: 4,
      title: "Institutional Member",
      price: "Rs 15,000/-",
      description: "Complete institutional access with premium benefits",
      features: ["Institution-wide access", "Bulk registrations", "Priority support", "Custom training programs"]
    },
    {
      id: 5,
      title: "Research Scholar (Life Member)",
      price: "Rs 2,000/-",
      description: "Specialized membership for research scholars",
      features: ["Research database access", "Publication opportunities", "Conference discounts", "Mentorship programs"]
    },
    {
      id: 6,
      title: "Student Member",
      price: "Rs 250/-",
      description: "Affordable membership option for students",
      features: ["Student resources", "Event access", "Study materials", "Career guidance"]
    },
    {
      id: 7,
      title: "Donor Member",
      price: "Rs 20,000/- & Above",
      description: "Premium membership with exclusive donor benefits",
      features: ["VIP access", "Exclusive events", "Recognition benefits", "Advisory board participation"]
    }
  ];

  const handleBuyNow = (membership) => {
    window.open(`/form?type=${encodeURIComponent(membership.title)}`, '_blank');
  };

  return (
    <div className="membership-container">
      <div className="membership-header">
        <h1>BE A MEMBER OF BMS</h1>
        <p>Choose your membership type and join our community</p>
      </div>
      
      <div className="membership-grid">
        {membershipTypes.map((membership) => (
          <div key={membership.id} className="membership-card">
            <div className="card-header">
              <h3 className="card-title">{membership.title}</h3>
              <div className="price-tag">
                <span className="price">{membership.price}</span>
              </div>
            </div>
            
            <div className="card-body">
              <p className="description">{membership.description}</p>
              <ul className="features-list">
                {membership.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <span className="checkmark">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="card-footer">
              <button 
                className="buy-now-btn"
                onClick={() => handleBuyNow(membership)}
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembershipPrices;