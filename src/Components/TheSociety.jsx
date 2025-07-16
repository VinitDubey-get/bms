import React, { useState } from 'react';
import { Calendar, Award, Users, BookOpen, Trophy, Star, ChevronRight, MapPin } from 'lucide-react';
import './TheSociety.css';
import { useNavigate } from 'react-router-dom'; 

const AboutSociety = () => {
  const [activeTab, setActiveTab] = useState('overview');

   const navigate = useNavigate();
   const handleJoinClick = () => {
    navigate('/membership'); // ✅ Navigate to society page
  };
  const handleDonateClick = () => {
    navigate('/donation'); // ✅ Navigate to society page
  };

  const milestones = [
    { year: '1907', event: 'Founded as Indian Mathematical Club by V. Ramaswami Aiyer', icon: '🏛️' },
    { year: '1910', event: 'Renamed to Indian Mathematical Society & Journal launched', icon: '📚' },
    { year: '1910', event: 'Ramanujan meets V. Ramaswami Aiyer', icon: '⭐' },
    { year: '1916', event: 'First Conference held at Madras', icon: '🎯' },
    { year: '1933', event: 'The Mathematics Student journal started', icon: '📖' },
    { year: '1951', event: 'Annual conferences begin', icon: '🎪' },
    { year: '2007', event: 'Centenary Year Celebrations', icon: '🎉' },
    { year: '2017', event: 'International participation begins', icon: '🌍' }
  ];

  const awards = [
    { name: 'P. L. Bhatnagar Memorial Award', year: '1987', icon: '🏆' },
    { name: 'Srinivasa Ramanujan Memorial Award', year: '1990', icon: '⭐' },
    { name: 'V. Ramaswami Aiyer Memorial Award', year: '1990', icon: '🎖️' },
    { name: 'Hansraj Gupta Memorial Award', year: '1990', icon: '🏅' },
    { name: 'Ganesh Prasad Memorial Award', year: '1993', icon: '👑' }
  ];

  const activities = [
    { title: 'Annual Conferences', desc: 'International meetings with plenary lectures and research presentations', icon: <Calendar className="activity-icon" /> },
    { title: 'Journal Publications', desc: 'Two premier journals: Journal of IMS and The Mathematics Student', icon: <BookOpen className="activity-icon" /> },
    { title: 'Memorial Lectures', desc: 'Distinguished lectures honoring mathematical pioneers', icon: <Award className="activity-icon" /> },
    { title: 'Research Prizes', desc: 'AMU Prize, V.M. Shah Prize, and other competitions', icon: <Trophy className="activity-icon" /> },
    { title: 'Sponsored Lectures', desc: 'Popular and technical lectures across institutions', icon: <Users className="activity-icon" /> },
    { title: 'Olympiad Support', desc: 'P.L. Bhatnagar Prize for top Indian Mathematical Olympiad scorers', icon: <Star className="activity-icon" /> }
  ];

  return (
    <div className="about-society-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-pattern"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Bihar Mathematical Society
            </h1>
            <p className="hero-subtitle">
              Bihar's oldest scientific society, fostering mathematical excellence since 1958
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <Calendar className="stat-icon" />
                <span>Founded 1958</span>
              </div>
              <div className="stat-item">
                <Users className="stat-icon" />
                <span>3500+ Members</span>
              </div>
              <div className="stat-item">
                <MapPin className="stat-icon" />
                <span>Headquarters:  Bhagalpur , Patna</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <div className="nav-container">
          <div className="nav-buttons">
            {[
              { id: 'overview', label: 'Overview', icon: '🏛️' },
              { id: 'history', label: 'History', icon: '📚' },
              { id: 'activities', label: 'Activities', icon: '🎯' },
              { id: 'awards', label: 'Awards', icon: '🏆' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              >
                <span className="tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="content-container">
        {/* Overview Section */}
        {activeTab === 'overview' && (
          <div className="section-content">
            <div className="overview-section">
              <h2 className="section-title">About IMS</h2>
              <div className="overview-content">
                <p className="overview-text">
                  The Bihar Mathematical Society stands as India's premier mathematical institution, 
                  founded in 1907 by the visionary V. Ramaswami Aiyer. Our mission is to promote 
                  mathematics education and research while inspiring generations of mathematicians.
                </p>
                <div className="overview-cards">
                  <div className="overview-card mission">
                    <h3 className="card-title">Our Mission</h3>
                    <p className="card-text">
                      To inspire and encourage researchers, students, and all mathematics-loving persons 
                      through education, research, and collaborative excellence.
                    </p>
                  </div>
                  <div className="overview-card legacy">
                    <h3 className="card-title">Legacy</h3>
                    <p className="card-text">
                      Home to Srinivasa Ramanujan's early works and countless mathematical 
                      breakthroughs that have shaped India's scientific landscape.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Section */}
        {activeTab === 'history' && (
          <div className="section-content">
            <div className="history-section">
              <h2 className="section-title">Our Journey</h2>
              <p className="history-subtitle">
                From a small mathematical club to India's most prestigious mathematical society
              </p>
              
              <div className="timeline">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <span className="timeline-icon">{milestone.icon}</span>
                        <span className="timeline-year">{milestone.year}</span>
                      </div>
                      <p className="timeline-event">{milestone.event}</p>
                    </div>
                    <div className="timeline-dot"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Activities Section */}
        {activeTab === 'activities' && (
          <div className="section-content">
            <div className="activities-section">
              <h2 className="section-title">Our Activities</h2>
              <p className="activities-subtitle">
                Comprehensive programs designed to advance mathematical knowledge and research
              </p>
              
              <div className="activities-grid">
                {activities.map((activity, index) => (
                  <div key={index} className="activity-card">
                    <div className="activity-header">
                      <div className="activity-icon-container">
                        {activity.icon}
                      </div>
                      <h3 className="activity-title">{activity.title}</h3>
                    </div>
                    <p className="activity-description">{activity.desc}</p>
                    <div className="activity-more">
                      <span className="activity-more-text">Learn More</span>
                      <ChevronRight className="activity-chevron" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Awards Section */}
        {activeTab === 'awards' && (
          <div className="section-content">
            <div className="awards-section">
              <h2 className="section-title">Memorial Awards</h2>
              <p className="awards-subtitle">
                Honoring mathematical pioneers and recognizing outstanding contributions
              </p>
              
              <div className="awards-grid">
                {awards.map((award, index) => (
                  <div key={index} className="award-card">
                    <div className="award-emoji">{award.icon}</div>
                    <h3 className="award-name">{award.name}</h3>
                    <p className="award-year">Instituted in {award.year}</p>
                    <div className="award-divider"></div>
                  </div>
                ))}
              </div>
              
              <div className="special-recognition">
                <h3 className="special-recognition-title">Special Recognition</h3>
                <p className="special-recognition-text">
                  The P.L. Bhatnagar Memorial Prize is awarded annually to the top scorer of the Indian team 
                  participating in the International Mathematical Olympiad, encouraging young mathematical talent.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="footer-cta">
        <div className="footer-cta-content">
          <h2 className="footer-cta-title">Join Our Mathematical Community</h2>
          <p className="footer-cta-subtitle">
            Become a life member of India's oldest scientific society and be part of our mathematical legacy
          </p>
          <div className="footer-cta-buttons">
             <button className="cta-button primary" onClick={handleJoinClick}>Become a Member</button>
              <button className="cta-button secondary" onClick={handleDonateClick}>Donate to BMS</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSociety;