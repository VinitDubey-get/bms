// Gallery.jsx - Fixed Version with Better Cloudinary Configuration
import React, { useState, useEffect } from 'react';
import { Upload, X, ImageIcon, Trash2, Plus, Eye } from 'lucide-react';
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
import './Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    heading: '',
    file: null
  });
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [configError, setConfigError] = useState(null);

  // Cloudinary configuration - Better environment variable handling
  const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
  const CLOUDINARY_API_KEY = process.env.REACT_APP_CLOUDINARY_API_KEY;
  
  // Debug configuration on component load
  useEffect(() => {
    console.log('=== Cloudinary Configuration Debug ===');
    console.log('REACT_APP_CLOUDINARY_CLOUD_NAME:', CLOUDINARY_CLOUD_NAME);
    console.log('REACT_APP_CLOUDINARY_UPLOAD_PRESET:', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    console.log('REACT_APP_CLOUDINARY_UPLOAD_PRESET2:', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET2);
    console.log('REACT_APP_CLOUDINARY_API_KEY:', CLOUDINARY_API_KEY);
    console.log('All environment variables:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
    
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      const missingVars = [];
      if (!CLOUDINARY_CLOUD_NAME) missingVars.push('REACT_APP_CLOUDINARY_CLOUD_NAME');
      if (!CLOUDINARY_UPLOAD_PRESET) missingVars.push('REACT_APP_CLOUDINARY_UPLOAD_PRESET or REACT_APP_CLOUDINARY_UPLOAD_PRESET2');
      
      setConfigError(`Missing environment variables: ${missingVars.join(', ')}`);
    }
  }, []);

  // Cloudinary upload function - Enhanced error handling
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
    formData.append('folder', 'gallery');

    try {
      console.log('Uploading to Cloudinary...');
      console.log('Cloud name:', CLOUDINARY_CLOUD_NAME);
      console.log('Upload preset:', CLOUDINARY_UPLOAD_PRESET);
      console.log('File size:', file.size);
      console.log('File type:', file.type);
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
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
      
      return {
        secure_url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  };

  // Delete from Cloudinary - Simplified version (optional delete)
  const deleteFromCloudinary = async (publicId) => {
    if (!publicId || !CLOUDINARY_API_KEY) {
      console.warn('Cloudinary deletion skipped - missing public ID or API key');
      return true;
    }

    try {
      console.log('Attempting to delete from Cloudinary:', publicId);
      
      // For unsigned deletion, we'll use the destroy endpoint
      // Note: This requires the upload preset to allow deletion
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
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

  // Subscribe to Firestore gallery collection
  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('created_at', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const imageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setImages(imageList);
    }, (error) => {
      console.error('Error fetching images:', error);
    });

    return () => unsubscribe();
  }, []);

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

  // File validation
  const handleFileValidation = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, GIF, etc.)');
      return;
    }
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }
    
    setUploadData(prev => ({
      ...prev,
      file: file
    }));
  };

  // Upload handler - Enhanced validation
  const handleUpload = async () => {
    if (!uploadData.file || !uploadData.heading.trim()) {
      alert('Please provide both image and heading');
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
      
      // Upload to Cloudinary
      const cloudinaryResponse = await uploadToCloudinary(uploadData.file);
      console.log('Upload successful:', cloudinaryResponse);
      
      // Save to Firestore
      await addDoc(collection(db, 'gallery'), {
        heading: uploadData.heading.trim(),
        image_link: cloudinaryResponse.secure_url,
        public_id: cloudinaryResponse.public_id,
        created_at: new Date(),
        file_size: uploadData.file.size,
        file_type: uploadData.file.type,
        width: cloudinaryResponse.width,
        height: cloudinaryResponse.height
      });

      console.log('Image saved to Firestore successfully');

      // Reset form
      setUploadData({ heading: '', file: null });
      setShowUploadModal(false);
      
      alert('Image uploaded successfully!');
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Delete handler
  const handleDelete = async (imageId, publicId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    setDeleteLoading(imageId);
    try {
      // Try to delete from Cloudinary (optional)
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'gallery', imageId));
      
      alert('Image deleted successfully!');
      
    } catch (error) {
      console.error('Delete failed:', error);
      alert(`Failed to delete image: ${error.message}`);
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
    setUploadData({ heading: '', file: null });
    setDragActive(false);
  };

  // Preview image handler
  const handlePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
  };

  return (
    <div className="gallery-container">
      <div className="gallery-wrapper">
        {/* Configuration Error Alert */}
        {configError && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            color: '#fca5a5'
          }}>
            <strong>Configuration Error:</strong> {configError}
            <br />
            <small>Please check your .env file and ensure all required Cloudinary environment variables are set.</small>
          </div>
        )}

        {/* Header */}
        <div className="gallery-header">
          <div className="header-content">
            <h1>Gallery Management</h1>
            <p>Upload and manage your gallery images with ease</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn btn-primary"
            disabled={isUploading || !!configError}
          >
            <Plus size={20} />
            Upload Image
          </button>
        </div>

        {/* Stats */}
        <div className="gallery-stats">
          <div className="stat-card glass-card">
            <div className="stat-number">{images.length}</div>
            <div className="stat-label">Total Images</div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-number">
              {Math.round(images.reduce((acc, img) => acc + (img.file_size || 0), 0) / 1024 / 1024 * 100) / 100}
            </div>
            <div className="stat-label">Total Size (MB)</div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {images.map((image) => (
            <div key={image.id} className="glass-card image-card">
              <div className="image-container">
                <img
                  src={image.image_link}
                  alt={image.heading}
                  loading="lazy"
                />
                <div className="image-overlay">
                  <div className="overlay-actions">
                    <button
                      onClick={() => handlePreview(image.image_link)}
                      className="btn btn-preview tooltip"
                      data-tooltip="Preview Image"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(image.id, image.public_id)}
                      className="btn btn-danger tooltip"
                      data-tooltip="Delete Image"
                      disabled={deleteLoading === image.id}
                    >
                      {deleteLoading === image.id ? (
                        <div className="spinner-small"></div>
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="image-info">
                <h3 className="image-title">{image.heading}</h3>
                <div className="image-meta">
                  <span className="image-date">
                    {image.created_at?.toDate ? 
                      image.created_at.toDate().toLocaleDateString() : 
                      'Unknown date'
                    }
                  </span>
                  <span className="image-size">
                    {image.file_size ? `${Math.round(image.file_size / 1024)} KB` : ''}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {images.length === 0 && (
          <div className="empty-state">
            <ImageIcon size={64} />
            <h3>No images yet</h3>
            <p>Upload your first image to get started</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn btn-primary"
              disabled={!!configError}
            >
              <Plus size={20} />
              Upload First Image
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div 
            className="modal-content glass-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Upload New Image</h2>
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

              {/* File Upload Area */}
              <div
                className={`upload-area ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {uploadData.file ? (
                  <div className="preview-container">
                    <img
                      src={URL.createObjectURL(uploadData.file)}
                      alt="Preview"
                      className="preview-image"
                    />
                    <div className="preview-info">
                      <p className="preview-filename">{uploadData.file.name}</p>
                      <p className="preview-filesize">
                        {Math.round(uploadData.file.size / 1024)} KB
                      </p>
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
                    <p className="upload-text">Drag & drop an image here</p>
                    <p className="upload-subtext">or click to browse</p>
                    <div className="file-input-wrapper">
                      <label className="file-input-label">
                        Choose Image File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="file-input"
                          disabled={isUploading || !!configError}
                        />
                      </label>
                    </div>
                    <p className="upload-hint">Supports: JPG, PNG, GIF (Max 10MB)</p>
                  </div>
                )}
              </div>

              {/* Heading Input */}
              <div className="form-group">
                <label className="form-label">Image Title</label>
                <input
                  type="text"
                  value={uploadData.heading}
                  onChange={(e) => setUploadData(prev => ({ 
                    ...prev, 
                    heading: e.target.value 
                  }))}
                  className="form-input"
                  placeholder="Enter a descriptive title for your image..."
                  maxLength={100}
                  disabled={isUploading || !!configError}
                />
                <div className="character-count">
                  {uploadData.heading.length}/100 characters
                </div>
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={isUploading || !uploadData.file || !uploadData.heading.trim() || !!configError}
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
                    Upload Image
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="modal-backdrop" onClick={() => setPreviewImage(null)}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImage(null)}
              className="preview-close"
            >
              <X size={24} />
            </button>
            <img src={previewImage} alt="Preview" className="preview-full-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;