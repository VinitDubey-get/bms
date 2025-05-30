
import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust path as needed
import './Notices.css';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    category: '',
    date: ''
  });

  const categories = [
    'Conferences & Seminars',
    'Research Highlights', 
    'Membership Notices',
    'Academic & Student Activities',
    'Feature Articles',
    'Security & Technical Updates',
    'General Notices'
  ];

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'news_announcement'));
      const noticesData = [];
      querySnapshot.forEach((doc) => {
        noticesData.push({ id: doc.id, ...doc.data() });
      });
      setNotices(noticesData);
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  const getNoticesByCategory = (category) => {
    return notices.filter(notice => notice.category === category);
  };

  const handleAddNotice = async () => {
    if (!newNotice.title || !newNotice.content || !newNotice.category) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      await addDoc(collection(db, 'news_announcement'), {
        ...newNotice,
        date: newNotice.date || new Date().toISOString().split('T')[0],
        createdAt: new Date()
      });
      
      setNewNotice({ title: '', content: '', category: '', date: '' });
      setShowAddForm(false);
      fetchNotices();
    } catch (error) {
      console.error('Error adding notice:', error);
    }
  };

  const handleDeleteNotice = async (noticeId) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await deleteDoc(doc(db, 'news_announcement', noticeId));
        fetchNotices();
      } catch (error) {
        console.error('Error deleting notice:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="notices-container">
      <div className="notices-header">
        <h1>Notices Management</h1>
        <button 
          className="add-notice-btn"
          onClick={() => setShowAddForm(true)}
        >
          + Add New Notice
        </button>
      </div>

      {!selectedCategory ? (
        // Categories View
        <div className="categories-grid">
          {categories.map((category, index) => {
            const categoryNotices = getNoticesByCategory(category);
            return (
              <div 
                key={index}
                className="category-card"
                onClick={() => setSelectedCategory(category)}
              >
                <div className="category-header">
                  <h3>{category}</h3>
                  <span className="notice-count">{categoryNotices.length}</span>
                </div>
                <div className="category-preview">
                  {categoryNotices.slice(0, 2).map((notice, idx) => (
                    <div key={idx} className="preview-item">
                      <span className="preview-date">{formatDate(notice.date)}</span>
                      <span className="preview-title">{notice.title}</span>
                    </div>
                  ))}
                  {categoryNotices.length > 2 && (
                    <div className="more-notices">
                      +{categoryNotices.length - 2} more notices
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Category Details View
        <div className="category-details">
          <div className="category-details-header">
            <button 
              className="back-btn"
              onClick={() => setSelectedCategory(null)}
            >
              ← Back to Categories
            </button>
            <h2>{selectedCategory}</h2>
            <button 
              className="add-notice-btn"
              onClick={() => {
                setNewNotice({ ...newNotice, category: selectedCategory });
                setShowAddForm(true);
              }}
            >
              + Add Notice
            </button>
          </div>

          <div className="notices-list">
            {getNoticesByCategory(selectedCategory).map((notice) => (
              <div key={notice.id} className="notice-card">
                <div className="notice-header">
                  <div className="notice-date">{formatDate(notice.date)}</div>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteNotice(notice.id)}
                  >
                    Delete
                  </button>
                </div>
                <h3 className="notice-title">{notice.title}</h3>
                <p className="notice-content">{notice.content}</p>
              </div>
            ))}
            
            {getNoticesByCategory(selectedCategory).length === 0 && (
              <div className="no-notices">
                <p>No notices found in this category.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Notice Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Notice</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAddForm(false)}
              >
                ×
              </button>
            </div>
            
            <div className="notice-form">
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={newNotice.category}
                  onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date"
                  value={newNotice.date}
                  onChange={(e) => setNewNotice({ ...newNotice, date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="Enter notice title"
                />
              </div>

              <div className="form-group">
                <label>Content</label>
                <textarea 
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  placeholder="Enter notice content"
                  rows="5"
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowAddForm(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="button" onClick={handleAddNotice} className="submit-btn">
                  Add Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices;