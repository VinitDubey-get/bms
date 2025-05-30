
import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, User, Mail, Phone, MapPin, Building, Trash2, ArrowLeft, UserPlus } from 'lucide-react';
import './Members.css';

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

const MemberCard = ({ member, onDelete }) => (
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
            <Phone size={14} /> 
            {member.mobile}
          </span>
          <span className="meta-item">
            <MapPin size={14} /> 
            {member.address}
          </span>
        </div>
      </div>
    </div>
    <button 
      className="delete-btn"
      onClick={() => onDelete(member.id)}
      title="Delete Member"
    >
      <Trash2 size={16} />
    </button>
  </div>
);

const AddMemberModal = ({ isOpen, onClose, onAdd, category }) => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    organisation: '',
    address: '',
    mobile: '',
    email: '',
    membershipType: category || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.designation || !formData.organisation || 
        !formData.address || !formData.mobile || !formData.email || !formData.membershipType) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await onAdd(formData);
      setFormData({
        name: '',
        designation: '',
        organisation: '',
        address: '',
        mobile: '',
        email: '',
        membershipType: category || ''
      });
      onClose();
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    if (category) {
      setFormData(prev => ({ ...prev, membershipType: category }));
    }
  }, [category]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Member</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="add-member-form">
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label>Designation *</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Enter designation/position"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label>Organisation/Institution *</label>
            <input
              type="text"
              name="organisation"
              value={formData.organisation}
              onChange={handleChange}
              placeholder="Enter organisation name"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label>Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter complete address"
              rows="3"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Mobile No *</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="+91-XXXXXXXXXX"
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Membership Type *</label>
            <select
              name="membershipType"
              value={formData.membershipType}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="">Select Membership Type</option>
              {membershipCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="submit-btn" 
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Members = () => {
  const [members, setMembers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

  // Add member to Firestore
  const handleAddMember = async (newMemberData) => {
    try {
      const docRef = await addDoc(collection(db, 'member'), {
        ...newMemberData,
        createdAt: new Date().toISOString()
      });
      
      // Add to local state immediately
      setMembers(prev => [...prev, {
        id: docRef.id,
        ...newMemberData
      }]);
      
      console.log('Member added successfully with ID:', docRef.id);
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  };

  // Delete member from Firestore
  const handleDeleteMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'member', memberId));
      setMembers(prev => prev.filter(member => member.id !== memberId));
      console.log('Member deleted successfully');
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Failed to delete member. Please try again.');
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
            <button 
              className="add-member-global"
              onClick={() => setIsAddModalOpen(true)}
            >
              <UserPlus size={18} />
              Add Member
            </button>
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
            <button 
              className="add-member-global"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus size={18} />
              Add Member
            </button>
          </div>

          <div className="members-list">
            {membersByCategory[selectedCategory]?.length > 0 ? (
              membersByCategory[selectedCategory].map(member => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onDelete={handleDeleteMember}
                />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <User size={48} />
                </div>
                <h3>No members found</h3>
                <p>This category doesn't have any members yet.</p>
                <button 
                  className="add-first-member-btn"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus size={16} />
                  Add First Member
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMember}
        category={selectedCategory}
      />
    </div>
  );
};
export default Members;