import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { User, Mail, Phone, MapPin, Building, ArrowLeft } from 'lucide-react';
import './ShowMembers.css';

const membershipCategories = [
  'Life Member(Constituent College Teacher)',
  'Life Member (Affiliated College Teacher)',
  'Annual Member(Teacher)',
  'Institutional Member',
  'Research Scholar',
  'Student Member',
  'Donor Member'
];

const CategoryCard = ({ category, memberCount, onClick }) => (
  <div className="category-card" onClick={onClick}>
    <div className="category-header">
      <div className="category-icon">
        <User size={24} />
      </div>
      <div className="category-info">
        <h3>{category}</h3>
        <span className="member-count">{memberCount} members</span>
      </div>
    </div>
    <div className="category-arrow">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  </div>
);

const MemberCard = ({ member }) => (
  <div className="member-card">
    <div className="member-info">
      <div className="member-details">
        <h4>{member.name}</h4>
        <p className="designation">{member.designation}</p>
        <div className="member-meta">
          <span className="meta-item">
            <Building size={14} /> 
            {member.organisation}
          </span>
          <span className="meta-item">
            <Mail size={14} /> 
            {member.email}
          </span>
          <span className="meta-item">
            <MapPin size={14} /> 
            {member.address}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const Members = () => {
  const [members, setMembers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch members from Firestore
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'member'));
      const membersData = [];
      querySnapshot.forEach((doc) => {
        membersData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setMembers(membersData);
      setError(null);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to fetch members. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Group members by category
  const membersByCategory = members.reduce((acc, member) => {
    const category = member.membershipType;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(member);
    return acc;
  }, {});

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  if (loading) {
    return (
      <div className="member-management">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="member-management">
        <div className="error-state">
          <h3>Error</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchMembers}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="member-management">
      {!selectedCategory ? (
        <>
          <div className="view-header">
            <h2 className="view-title">Member Categories</h2>
          </div>
          
          <div className="categories-grid">
            {membershipCategories.map(category => (
              <CategoryCard
                key={category}
                category={category}
                memberCount={membersByCategory[category]?.length || 0}
                onClick={() => handleCategorySelect(category)}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="view-header">
            <button className="back-btn" onClick={handleBackToCategories}>
              <ArrowLeft size={20} />
            </button>
            <h2 className="view-title">{selectedCategory}</h2>
          </div>

          <div className="members-list">
            {membersByCategory[selectedCategory]?.length > 0 ? (
              membersByCategory[selectedCategory].map(member => (
                <MemberCard
                  key={member.id}
                  member={member}
                />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <User size={48} />
                </div>
                <h3>No members found</h3>
                <p>This category doesn't have any members yet.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Members;