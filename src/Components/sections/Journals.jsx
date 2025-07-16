// Journals.jsx - Complete Journals Management System with Fixed PDF Opening
import React, { useState, useEffect } from 'react';
import { Upload, X, FileText, Trash2, Plus, Eye, Download, Calendar } from 'lucide-react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  orderBy, 
  query 
} from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust path to your firebase config
import './Journals.css';

const Journals = () => {
  const [journals, setJournals] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description:'',
    publishDate: '',
    file: null
  });
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [previewJournal, setPreviewJournal] = useState(null);
  const [configError, setConfigError] = useState(null);

  // Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET2;
  const CLOUDINARY_API_KEY = process.env.REACT_APP_CLOUDINARY_API_KEY;
  
  // Debug configuration on component load
  useEffect(() => {
    console.log('=== Cloudinary Configuration Debug ===');
    console.log('REACT_APP_CLOUDINARY_CLOUD_NAME:', CLOUDINARY_CLOUD_NAME);
    console.log('REACT_APP_CLOUDINARY_UPLOAD_PRESET:', CLOUDINARY_UPLOAD_PRESET);
    console.log('REACT_APP_CLOUDINARY_API_KEY:', CLOUDINARY_API_KEY);
    
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      const missingVars = [];
      if (!CLOUDINARY_CLOUD_NAME) missingVars.push('REACT_APP_CLOUDINARY_CLOUD_NAME');
      if (!CLOUDINARY_UPLOAD_PRESET) missingVars.push('REACT_APP_CLOUDINARY_UPLOAD_PRESET or REACT_APP_CLOUDINARY_UPLOAD_PRESET2');
      
      setConfigError(`Missing environment variables: ${missingVars.join(', ')}`);
    }
  }, [CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET]);

  // Subscribe to Firestore journals collection
  useEffect(() => {
    console.log('Setting up Firestore listener...');
    const q = query(collection(db, 'journals'), orderBy('publishDate', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('Firestore snapshot received:', snapshot.docs.length, 'documents');
      const journalList = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Document ID:', doc.id);
        console.log('Document data:', data);
        return {
          id: doc.id,
          ...data
        };
      });
      console.log('Processed journals:', journalList.map(j => ({ id: j.id, title: j.title, pdfUrl: j.pdfUrl })));
      setJournals(journalList);
    }, (error) => {
      console.error('Error fetching journals:', error);
    });

    return () => unsubscribe();
  }, []);

  // FIXED: Cloudinary upload function for PDFs with proper resource type
  const uploadToCloudinary = async (file) => {
    // Validate configuration before upload
    if (!CLOUDINARY_CLOUD_NAME) {
      throw new Error('REACT_APP_CLOUDINARY_CLOUD_NAME is not configured');
    }
    if (!CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('REACT_APP_CLOUDINARY_UPLOAD_PRESET (or REACT_APP_CLOUDINARY_UPLOAD_PRESET2) is not configured');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'journals');
    formData.append('resource_type', 'raw'); // FIXED: Use 'raw' for PDF files instead of 'auto'
    formData.append('public_id', `journal_${Date.now()}`); // Add unique public_id

    try {
      console.log('Uploading PDF to Cloudinary...');
      console.log('Cloud name:', CLOUDINARY_CLOUD_NAME);
      console.log('Upload preset:', CLOUDINARY_UPLOAD_PRESET);
      console.log('File size:', file.size);
      console.log('File type:', file.type);
      
      // FIXED: Use 'raw' endpoint for PDF uploads
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      const result = await response.json();
      console.log('Cloudinary response status:', response.status);
      console.log('Cloudinary response:', result);
      
      if (!response.ok) {
        console.error('Cloudinary error details:', result);
        throw new Error(`Upload failed: ${response.status} - ${result.error?.message || response.statusText}`);
      }
      
      if (result.error) {
        console.error('Cloudinary result error:', result.error);
        throw new Error(result.error.message);
      }
      
      // FIXED: Generate proper PDF viewing URL
      const pdfViewUrl = result.secure_url;
      console.log('Generated PDF URL:', pdfViewUrl);
      
      return {
        secure_url: pdfViewUrl,
        public_id: result.public_id,
        pages: result.pages,
        bytes: result.bytes,
        format: result.format
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(`Failed to upload PDF: ${error.message}`);
    }
  };

  // Delete from Cloudinary - FIXED for raw files
  const deleteFromCloudinary = async (publicId) => {
    if (!publicId || !CLOUDINARY_API_KEY) {
      console.warn('Cloudinary deletion skipped - missing public ID or API key');
      return true;
    }

    try {
      console.log('Attempting to delete from Cloudinary:', publicId);
      
      // FIXED: Use raw/destroy endpoint for PDF files
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/destroy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            public_id: publicId,
            api_key: CLOUDINARY_API_KEY,
            timestamp: Math.round(new Date().getTime() / 1000)
          }),
        }
      );

      const result = await response.json();
      console.log('Cloudinary delete response:', result);
      
      return result.result === 'ok' || result.result === 'not found';
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return false;
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileValidation(file);
    }
  };

  // File selection handler
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFileValidation(file);
    }
  };

  // File validation for PDFs
  const handleFileValidation = (file) => {
    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file only');
      return;
    }
    
    // Check file size (limit to 50MB for PDFs)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB');
      return;
    }
    
    setUploadData(prev => ({
      ...prev,
      file: file
    }));
  };

  // Upload handler
  const handleUpload = async () => {
    if (!uploadData.file || !uploadData.title.trim() || !uploadData.publishDate) {
      alert('Please provide title, publish date, and PDF file');
      return;
    }

    // Enhanced validation with detailed error messages
    if (!CLOUDINARY_CLOUD_NAME) {
      alert('Cloudinary Cloud Name is missing. Please add REACT_APP_CLOUDINARY_CLOUD_NAME to your .env file.');
      return;
    }

    if (!CLOUDINARY_UPLOAD_PRESET) {
      alert('Cloudinary Upload Preset is missing. Please add REACT_APP_CLOUDINARY_UPLOAD_PRESET to your .env file.');
      return;
    }

    setIsUploading(true);
    try {
      console.log('Starting upload process...');
      console.log('Upload data:', uploadData);
      
      // Upload to Cloudinary
      const cloudinaryResponse = await uploadToCloudinary(uploadData.file);
      console.log('Upload successful:', cloudinaryResponse);
      
      // Prepare data for Firestore
      const firestoreData = {
        title: uploadData.title.trim(),
        publishDate: uploadData.publishDate,
         description: uploadData.description.trim(),
        pdfUrl: cloudinaryResponse.secure_url,
        public_id: cloudinaryResponse.public_id,
        created_at: new Date(),
        file_size: uploadData.file.size,
        file_type: uploadData.file.type,
        pages: cloudinaryResponse.pages || null,
        bytes: cloudinaryResponse.bytes || uploadData.file.size
      };
      
      console.log('Saving to Firestore with data:', firestoreData);
      
      // Save to Firestore
      const docRef = await addDoc(collection(db, 'journals'), firestoreData);
      console.log('Journal saved to Firestore with ID:', docRef.id);

      // Reset form
      setUploadData({ title: '', publishDate: '', file: null });
      setShowUploadModal(false);
      
      alert('Journal uploaded successfully!');
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Delete handler
  const handleDelete = async (journalId, publicId) => {
    if (!window.confirm('Are you sure you want to delete this journal?')) return;

    setDeleteLoading(journalId);
    try {
      // Try to delete from Cloudinary first
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'journals', journalId));
      
      alert('Journal deleted successfully!');
      
    } catch (error) {
      console.error('Delete failed:', error);
      alert(`Failed to delete journal: ${error.message}`);
    } finally {
      setDeleteLoading(null);
    }
  };

  // Remove selected file
  const removeFile = () => {
    setUploadData(prev => ({ ...prev, file: null }));
    // Reset file input
    const fileInput = document.querySelector('.file-input');
    if (fileInput) fileInput.value = '';
  };

  // Close modal handler
  const closeModal = () => {
    setShowUploadModal(false);
    setUploadData({ title: '', publishDate: '', file: null });
    setDragActive(false);
  };

  // FIXED: Enhanced PDF handling functions
  const validatePdfUrl = (url) => {
    if (!url) {
      console.error('PDF URL is empty or undefined');
      return false;
    }
    
    // Check if it's a valid URL
    try {
      new URL(url);
      console.log('Valid PDF URL:', url);
      return true;
    } catch (error) {
      console.error('Invalid PDF URL:', url, error);
      return false;
    }
  };

  // FIXED: Enhanced preview handler with multiple viewing options
  const handlePreview = async (journal) => {
    console.log('Attempting to preview journal:', journal);
    
    if (!journal || !journal.pdfUrl) {
      alert('PDF URL is not available for this journal');
      return;
    }

    if (!validatePdfUrl(journal.pdfUrl)) {
      alert('Invalid PDF URL. Please try re-uploading the journal.');
      return;
    }

    const pdfUrl = journal.pdfUrl;
    console.log('PDF URL to open:', pdfUrl);

    try {
      // Method 1: Direct PDF opening with proper headers
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Add PDF viewing parameters
      const urlWithParams = `${pdfUrl}#view=FitH&toolbar=1&navpanes=1&scrollbar=1`;
      
      // Try to open directly first
      const newWindow = window.open(urlWithParams, '_blank', 'noopener,noreferrer');
      
      if (!newWindow || newWindow.closed) {
        console.warn('Direct open failed, trying alternative...');
        
        // Method 2: Force download if viewing fails
        link.download = `${journal.title || 'journal'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Also try iframe method
        handleEmbeddedPreview(journal);
      } else {
        console.log('PDF opened successfully in new tab');
      }
      
    } catch (error) {
      console.error('Error accessing PDF:', error);
      
      // Fallback to Google Docs viewer
      console.log('Falling back to Google Docs viewer...');
      handleEmbeddedPreview(journal);
    }
  };

  // FIXED: Enhanced download handler
  const handleDownload = async (journal) => {
    console.log('Attempting to download journal:', journal);
    
    if (!journal || !journal.pdfUrl) {
      alert('PDF URL is not available for this journal');
      return;
    }

    if (!validatePdfUrl(journal.pdfUrl)) {
      alert('Invalid PDF URL. Please try re-uploading the journal.');
      return;
    }

    try {
      // Create a temporary link for download
      const link = document.createElement('a');
      link.href = journal.pdfUrl;
      link.download = `${journal.title || 'journal'}.pdf`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Download initiated for:', journal.title);
      
    } catch (error) {
      console.error('Download error:', error);
      alert(`Unable to download PDF: ${error.message}`);
    }
  };

  // FIXED: Alternative method to open PDF in embedded viewer
  const handleEmbeddedPreview = (journal) => {
    if (!journal || !journal.pdfUrl) {
      alert('PDF URL is not available for this journal');
      return;
    }

    const pdfUrl = journal.pdfUrl;
    console.log('Opening in embedded viewer:', pdfUrl);

    // Try multiple viewer options
    const viewers = [
      // Google Docs viewer
      `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`,
      // Microsoft Office viewer
      `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(pdfUrl)}`,
      // Mozilla PDF.js viewer
      `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`
    ];

    // Try each viewer
    let viewerIndex = 0;
    const tryNextViewer = () => {
      if (viewerIndex < viewers.length) {
        const viewerUrl = viewers[viewerIndex];
        console.log(`Trying viewer ${viewerIndex + 1}:`, viewerUrl);
        
        const newWindow = window.open(viewerUrl, '_blank', 'noopener,noreferrer');
        
        if (!newWindow || newWindow.closed) {
          viewerIndex++;
          tryNextViewer();
        }
      } else {
        // If all viewers fail, try direct download
        console.log('All viewers failed, attempting direct download...');
        handleDownload(journal);
      }
    };

    tryNextViewer();
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format file size helper
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / (1024 * 1024) * 100) / 100 + ' MB';
  };

  return (
    <div className="journals-container">
      <div className="journals-wrapper">
        {/* Configuration Error Alert */}
        {configError && (
          <div className="config-error">
            <strong>Configuration Error:</strong> {configError}
            <br />
            <small>Please check your .env file and ensure all required Cloudinary environment variables are set.</small>
          </div>
        )}

        {/* Header */}
        <div className="journals-header">
          <div className="header-content">
            <h1>Journals Management</h1>
            <p>Upload and manage your journal publications</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn btn-primary"
            disabled={isUploading || !!configError}
          >
            <Plus size={20} />
            Upload Journal
          </button>
        </div>

        {/* Stats */}
        <div className="journals-stats">
          <div className="stat-card">
            <div className="stat-number">{journals.length}</div>
            <div className="stat-label">Total Journals</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {Math.round(journals.reduce((acc, journal) => acc + (journal.file_size || 0), 0) / 1024 / 1024 * 100) / 100}
            </div>
            <div className="stat-label">Total Size (MB)</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {journals.filter(j => new Date(j.publishDate) >= new Date(new Date().getFullYear(), 0, 1)).length}
            </div>
            <div className="stat-label">This Year</div>
          </div>
        </div>

        {/* Journals Grid */}
        {journals.length > 0 ? (
          <div className="journals-grid">
  {journals.map((journal) => (
    <div key={journal.id} className="journal-card">
      <div className="journal-icon-container cool-gradient-bg">
        <FileText size={48} className="journal-icon" />
        <div className="journal-overlay">
          <button
            onClick={() => handlePreview(journal)}
            className="btn-preview tooltip"
            data-tooltip="View PDF"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleDelete(journal.id, journal.public_id)}
            className="btn-danger tooltip"
            data-tooltip="Delete Journal"
            disabled={deleteLoading === journal.id}
          >
            {deleteLoading === journal.id ? <div className="spinner-small"></div> : <Trash2 size={18} />}
          </button>
        </div>
      </div>
      <div className="journal-info">
        <h3 className="journal-title">{journal.title || 'Untitled Journal'}</h3>
        <div className="journal-date">
          <Calendar size={14} /> {formatDate(journal.publishDate)}
        </div>
        <p className="journal-description">{journal.description || 'No description provided.'}</p>
      </div>
    </div>
  ))}
</div>
        ) : (
          /* Empty State */
          <div className="empty-state">
            <FileText size={64} />
            <h3>No journals yet</h3>
            <p>Upload your first journal to get started</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn btn-primary"
              disabled={!!configError}
            >
              <Plus size={20} />
              Upload First Journal
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Upload New Journal</h2>
              <button
                onClick={closeModal}
                className="modal-close"
                disabled={isUploading}
              >
                <X size={24} />
              </button>
            </div>

            <div>
              {/* Configuration check in modal */}
              {configError && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '16px',
                  color: '#fca5a5',
                  fontSize: '0.875rem'
                }}>
                  Upload disabled: {configError}
                </div>
              )}

              {/* Title Input */}
              <div className="form-group">
                <label className="form-label">Journal Title *</label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) => setUploadData(prev => ({ 
                    ...prev, 
                    title: e.target.value 
                  }))}
                  className="form-input"
                  placeholder="Enter journal title..."
                  maxLength={200}
                  disabled={isUploading || !!configError}
                  required
                />
                <div className="character-count">
                  {uploadData.title.length}/200 characters
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={uploadData.description}
                  onChange={(e) => setUploadData(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  className="form-input"
                  placeholder="Enter short description..."
                  maxLength={500}
                  disabled={isUploading || !!configError}
                />
                <div className="character-count">{uploadData.description.length}/500 characters</div>
              </div>

              {/* Publish Date Input */}
              <div className="form-group">
                <label className="form-label">Publish Date *</label>
                <input
                  type="date"
                  value={uploadData.publishDate}
                  onChange={(e) => setUploadData(prev => ({ 
                    ...prev, 
                    publishDate: e.target.value 
                  }))}
                  className="form-input"
                  disabled={isUploading || !!configError}
                  required
                />
              </div>

              {/* File Upload Area */}
              <div className="form-group">
                <label className="form-label">PDF File *</label>
                <div
                  className={`upload-area ${dragActive ? 'drag-active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {uploadData.file ? (
                    <div className="preview-container">
                      <div className="pdf-preview">
                        <FileText size={48} className="pdf-icon" />
                        <div className="pdf-info">
                          <p className="preview-filename">{uploadData.file.name}</p>
                          <p className="preview-filesize">
                            {formatFileSize(uploadData.file.size)}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={removeFile} 
                        className="remove-file"
                        disabled={isUploading}
                      >
                        Remove File
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload size={48} className="upload-icon" />
                      <p className="upload-text">Drag & drop a PDF here</p>
                      <p className="upload-subtext">or click to browse</p>
                      <div className="file-input-wrapper">
                        <label className="file-input-label">
                          Choose PDF File
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileSelect}
                            className="file-input"
                            disabled={isUploading || !!configError}
                          />
                        </label>
                      </div>
                      <p className="upload-hint">PDF files only (Max 50MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={isUploading || !uploadData.file || !uploadData.title.trim() || !uploadData.publishDate || !!configError}
                className={`btn upload-btn ${isUploading ? 'uploading' : 'btn-primary'}`}
              >
                {isUploading ? (
                  <div className="upload-progress-content">
                    <div className="spinner"></div>
                    Uploading to Cloudinary...
                  </div>
                ) : (
                  <>
                    <Upload size={20} />
                    Upload Journal
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Journals;