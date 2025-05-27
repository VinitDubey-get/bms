// NewsAnnouncementsSection.jsx
import React, { useState } from 'react';
import { ChevronRight, X, Calendar, Bell } from 'lucide-react';
import './News&Announcement.css';

const NewsAnnouncementsSection = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const announcements = [
    {
      id: 5,
      title: "System Maintenance Scheduled",
      content: "Our systems will undergo scheduled maintenance on Sunday, May 25th from 2:00 AM to 4:00 AM EST. During this time, some services may be temporarily unavailable.",
      date: "May 22, 2025",
      type: "maintenance"
    },
    
    {
      id: 2,
      title: "New Feature Release",
      content: "We're excited to announce the launch of our new dashboard analytics feature. Users can now access detailed insights and reports directly from their dashboard.",
      date: "May 20, 2025",
      type: "feature"
    },
    {
      id: 3,
      title: "Security Update",
      content: "We've implemented enhanced security measures to protect your data. All users are advised to update their passwords and enable two-factor authentication.",
      date: "May 18, 2025",
      type: "security"
    },
   
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'maintenance': return '🔧';
      case 'feature': return '✨';
      case 'security': return '🔒';
      case 'partnership': return '🤝';
      default: return '📢';
    }
  };

  return (
    <div className="news-section">
      <div className="news-container">
        {/* Main Card */}
        <div className="news-card">
          {/* Header */}
          <div className="news-header">
            <div className="header-content">
              <Bell className="header-icon" />
              <h1 className="header-title">News & Announcements</h1>
            </div>
            <p className="header-subtitle">Stay updated with our latest news and important announcements</p>
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
                      <span className={`announcement-badge ${announcement.type}`}>
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
            <div className="view-more-container">
              <button
                onClick={() => setIsOverlayOpen(true)}
                className="view-more-btn"
              >
                View More
                <ChevronRight className="btn-icon" />
              </button>
            </div>
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
                        <span className={`overlay-announcement-badge ${announcement.type}`}>
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