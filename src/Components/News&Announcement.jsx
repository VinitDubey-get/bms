// NewsAnnouncementsSection.jsx
import React, { useState, useEffect } from 'react';
import { ChevronRight, X, Calendar, Bell } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path based on your firebase.js location
import './News&Announcement.css';

const NewsAnnouncementsSection = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch announcements from Firebase
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'news_announcement'));
        const fetchedAnnouncements = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedAnnouncements.push({
            id: doc.id,
            title: data.title,
            content: data.content,
            date: data.date && typeof data.date === 'object' && data.date.toDate 
              ? data.date.toDate().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })
              : data.date,
            type: data.category,
            createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
          });
        });
        
        // Sort by createdAt in descending order (newest first)
        fetchedAnnouncements.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return 0;
        });
        
        setAnnouncements(fetchedAnnouncements);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching announcements:', error);
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'conferences & seminars': return '🎓';
      case 'research highlights': return '🔬';
      case 'membership notices': return '👥';
      case 'academic & student activities': return '📚';
      case 'feature articles': return '📝';
      case 'security & technical updates': return '🔒';
      case 'general notices': return '📢';
      default: return '📢';
    }
  };

  if (loading) {
    return (
      <div className="bms-news-section">
        <div className="bms-news-container">
          <div className="bms-news-card">
            <div className="bms-news-header">
              <div className="bms-header-content">
                <Bell className="bms-header-icon" />
                <h1 className="bms-header-title">News & Announcements</h1>
              </div>
              <p className="bms-header-subtitle">Loading announcements...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bms-news-section">
      <div className="bms-news-container">
        {/* Main Card */}
        <div className="bms-news-card">
          {/* Header */}
          <div className="bms-news-header">
            <div className="bms-header-content">
              <Bell className="bms-header-icon" />
              <h1 className="bms-header-title">News & Announcements</h1>
            </div>
            <p className="bms-header-subtitle">Stay updated with our latest news and important announcements</p>
          </div>

          {/* Announcements List */}
          <div className="news-content">
            <div className="announcements-list">
              {announcements.slice(0, 3).map((announcement) => (
                <div key={announcement.id} className="announcement-item">
                  <div className="announcement-content">
                    <div className="announcement-header">
                      <span className="announcement-icon">{getTypeIcon(announcement.type)}</span>
                      <h3 className="announcement-title">{announcement.title}</h3>
                      <span className={`announcement-badge ${announcement.type?.toLowerCase().replace(/\s+/g, '-')}`}>
                        {announcement.type}
                      </span>
                    </div>
                    <p className="announcement-text">{announcement.content}</p>
                    <div className="announcement-date">
                      <Calendar className="date-icon" />
                      <span>{announcement.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View More Button */}
            {announcements.length > 3 && (
              <div className="view-more-container">
                <button
                  onClick={() => setIsOverlayOpen(true)}
                  className="view-more-btn"
                >
                  View More
                  <ChevronRight className="btn-icon" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOverlayOpen && (
        <div className="overlay">
          <div className="overlay-content">
            {/* Overlay Header */}
            <div className="overlay-header">
              <div className="overlay-title-section">
                <Bell className="overlay-icon" />
                <h2 className="overlay-title">All Announcements</h2>
              </div>
              <button
                onClick={() => setIsOverlayOpen(false)}
                className="close-btn"
              >
                <X className="close-icon" />
              </button>
            </div>

            {/* Overlay Content */}
            <div className="overlay-body">
              <div className="overlay-announcements">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="overlay-announcement-item">
                    <div className="overlay-announcement-header">
                      <div className="overlay-announcement-info">
                        <span className="overlay-announcement-icon">{getTypeIcon(announcement.type)}</span>
                        <h3 className="overlay-announcement-title">{announcement.title}</h3>
                        <span className={`overlay-announcement-badge ${announcement.type?.toLowerCase().replace(/\s+/g, '-')}`}>
                          {announcement.type}
                        </span>
                      </div>
                      <div className="overlay-announcement-date">
                        <Calendar className="overlay-date-icon" />
                        <span>{announcement.date}</span>
                      </div>
                    </div>
                    <p className="overlay-announcement-text">{announcement.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsAnnouncementsSection;