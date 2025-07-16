import React, { useState, useEffect } from 'react';
import { Eye, Calendar, FileText, ExternalLink, Maximize, Minimize } from 'lucide-react';
import { db } from '../firebase'; // Import your Firebase config
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import './Journal.css';

const JournalCard = ({ journal, onView }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="journal-card">
      <div className="journal-card-header">
        <div className="journal-card-content">
          <h3 className="journal-title">
            {journal.title}
          </h3>
          <p className="journal-description">
            {journal.description || 'No description available'}
          </p>
          <div className="journal-date">
            <Calendar className="date-icon" />
            <span>Published: {formatDate(journal.publishDate)}</span>
          </div>
        </div>
      </div>
      
      <div className="journal-card-footer">
        <div className="journal-type">
          <FileText className="type-icon" />
          <span className="type-text">Research Paper</span>
        </div>
        
        <button
          onClick={() => onView(journal)}
          className="view-button"
        >
          <Eye className="view-icon" />
          View
        </button>
      </div>
    </div>
  );
};

const PDFViewer = ({ journal, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`pdf-viewer-overlay ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className={`pdf-viewer-modal ${isFullscreen ? 'fullscreen-modal' : ''}`}>
        <div className="pdf-viewer-header">
          <h3 className="pdf-viewer-title">
            {journal.title}
          </h3>
          <div className="pdf-viewer-actions">
            <button
              onClick={toggleFullscreen}
              className="fullscreen-button"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize className="fullscreen-icon" /> : <Maximize className="fullscreen-icon" />}
            </button>
            <button
              onClick={onClose}
              className="close-button"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="pdf-viewer-content">
          <div className="pdf-iframe-container">
            <iframe
              src={`${journal.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="pdf-iframe"
              title={journal.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const JournalComponent = () => {
  const [journals, setJournals] = useState([]);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Create a reference to the journals collection
        const journalsRef = collection(db, 'journals');
        
        // Create a query to order by publishDate (newest first)
        const q = query(journalsRef, orderBy('publishDate', 'desc'));
        
        // Get the documents
        const querySnapshot = await getDocs(q);
        
        // Map the documents to journal objects
        const journalData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || 'Untitled Journal',
            description: data.description || '',
            publishDate: data.publishDate || new Date().toISOString().split('T')[0],
            pdfUrl: data.pdfUrl || '',
            file_type: data.file_type || 'application/pdf',
            pages: data.pages || null,
            public_id: data.public_id || '',
            created_at: data.created_at || null
          };
        });
        
        setJournals(journalData);
      } catch (error) {
        console.error('Error fetching journals:', error);
        setError('Failed to load journals. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
  }, []);

  const handleView = (journal) => {
    setSelectedJournal(journal);
  };

  const handleClose = () => {
    setSelectedJournal(null);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="journals-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="loading-card">
              <div className="loading-title"></div>
              <div className="loading-line"></div>
              <div className="loading-line"></div>
              <div className="loading-button"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-state">
          <p className="error-text">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="main-title">Research Journals</h1>
        <p className="main-subtitle">Explore our collection of academic research papers</p>
      </div>
      
      <div className="journals-grid">
        {journals.map((journal) => (
          <JournalCard
            key={journal.id}
            journal={journal}
            onView={handleView}
          />
        ))}
      </div>
      
      {journals.length === 0 && !loading && (
        <div className="empty-state">
          <FileText className="empty-icon" />
          <p className="empty-text">No journals found</p>
        </div>
      )}
      
      {selectedJournal && (
        <PDFViewer
          journal={selectedJournal}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default JournalComponent;