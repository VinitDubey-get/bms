import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase' // adjust path as needed
import AwardCard from './AwardCard';
import './Awards.css';

const Awards = () => {
  const [awards, setAwards] = useState([]);
  const [name, setName] = useState('');
  const [prizeName, setPrizeName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  // Cloudinary configuration from environment variables
  // Since this is admin-only (behind authentication), using API secret is acceptable
  const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_API_KEY = process.env.REACT_APP_CLOUDINARY_API_KEY;
  const CLOUDINARY_API_SECRET = process.env.REACT_APP_CLOUDINARY_API_SECRET;

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'award_prize'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAwards(data);
    } catch (error) {
      console.error('Error fetching awards:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'awards'); // Optional: organize images in a folder

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      const data = await response.json();
      return {
        imageUrl: data.secure_url,
        publicId: data.public_id
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  // Function to generate signature for authenticated requests
  const generateSignature = (publicId, timestamp) => {
    // Using crypto-js for SHA1 hashing
    // Install: npm install crypto-js
    const CryptoJS = require('crypto-js');
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    return CryptoJS.SHA1(stringToSign).toString();
  };

  // Delete image from Cloudinary using signed request
  const deleteFromCloudinary = async (publicId) => {
    if (!publicId) {
      console.warn('No public ID provided for Cloudinary deletion');
      return;
    }

    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const signature = generateSignature(publicId, timestamp);
      
      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('timestamp', timestamp.toString());
      formData.append('api_key', CLOUDINARY_API_KEY);
      formData.append('signature', signature);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.result === 'ok') {
        console.log('Image successfully deleted from Cloudinary:', publicId);
        return true;
      } else if (result.result === 'not found') {
        console.warn('Image not found in Cloudinary:', publicId);
        return true; // Consider it success since image doesn't exist
      } else {
        console.warn('Cloudinary deletion response:', result);
        return false;
      }
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      return false;
    }
  };

  // Method using upload preset with deletion permissions
  const deleteFromCloudinaryUnsigned = async (publicId) => {
    if (!publicId) return;

    try {
      // This works if your upload preset is configured to allow deletions
      // Go to Cloudinary Dashboard → Settings → Upload Presets
      // Edit your preset and enable "Allow deletion" option
      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();
      
      if (result.result === 'ok') {
        console.log('Image successfully deleted from Cloudinary');
      } else {
        console.warn('Cloudinary deletion response:', result);
      }
    } catch (error) {
      console.error('Error deleting from Cloudinary (unsigned):', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (max 10MB for Cloudinary)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size should be less than 10MB');
        return;
      }
      setImageFile(file);
    }
  };

  const handleAdd = async () => {
    if (!name.trim() || !prizeName.trim() || !imageFile) {
      alert("All fields are required");
      return;
    }

    setUploading(true);
    try {
      // Upload image to Cloudinary
      const { imageUrl, publicId } = await uploadToCloudinary(imageFile);

      // Add to Firebase database
      await addDoc(collection(db, 'award_prize'), {
        name: name.trim(),
        prize_name: prizeName.trim(),
        image_link: imageUrl,
        cloudinary_public_id: publicId, // Store for deletion later
        created_at: new Date().toISOString()
      });

      // Reset form
      setName('');
      setPrizeName('');
      setImageFile(null);
      document.getElementById("file-input").value = null;

      // Refresh awards list
      await fetchAwards();

      alert('Award added successfully!');
    } catch (error) {
      console.error('Error adding award:', error);
      alert('Error adding award. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (awardId, publicId) => {
    if (!window.confirm('Are you sure you want to delete this award? This action cannot be undone.')) {
      return;
    }

    setDeleting(awardId);
    try {
      let cloudinarySuccess = true;
      
      // Attempt to delete from Cloudinary first
      if (publicId) {
        console.log('Deleting image from Cloudinary:', publicId);
        cloudinarySuccess = await deleteFromCloudinary(publicId);
      }

      // Delete from Firebase database regardless of Cloudinary result
      // (We don't want to leave orphaned database records)
      await deleteDoc(doc(db, 'award_prize', awardId));

      // Update local state
      setAwards(awards.filter(award => award.id !== awardId));

      // Show appropriate success message
      if (cloudinarySuccess) {
        alert('Award and image deleted successfully!');
      } else {
        alert('Award deleted from database. Note: There may have been an issue deleting the image from Cloudinary.');
      }
    } catch (error) {
      console.error('Error deleting award:', error);
      alert('Error deleting award. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const isFormValid = name.trim() && prizeName.trim() && imageFile;

  return (
    <div className="awards-section">
      <h3>🏆 Awards & Prizes</h3>
      
      {/* Awards List */}
      <div className="awards-list">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="award-card loading">
              <div className="award-image"></div>
              <div className="award-info">
                <div style={{ height: '20px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '8px' }}></div>
                <div style={{ height: '16px', background: '#f0f0f0', borderRadius: '4px' }}></div>
              </div>
            </div>
          ))
        ) : awards.length > 0 ? (
          awards.map(award => (
            <AwardCard
              key={award.id}
              image={award.image_link}
              name={award.name}
              prize={award.prize_name}
              onDelete={() => handleDelete(award.id, award.cloudinary_public_id)}
              isDeleting={deleting === award.id}
            />
          ))
        ) : (
          // Empty state
          <div className="empty-state">
            <div className="empty-state-icon">🏆</div>
            <h4>No Awards Yet</h4>
            <p>Add your first award to get started!</p>
          </div>
        )}
      </div>

      {/* Add New Award Section */}
      <div className="add-award-section">
        <h4>
          <div className="add-icon">+</div>
          Add New Award
        </h4>
        
        <div className="add-award-form">
          {/* File Input */}
          <div className="form-group">
            <label className="form-label">Award Image</label>
            <div className="file-input-wrapper">
              <label 
                htmlFor="file-input" 
                className={`file-input-button ${imageFile ? 'has-file' : ''}`}
              >
                <span className="upload-icon">
                  {imageFile ? '✅' : '📁'}
                </span>
                {imageFile ? `Selected: ${imageFile.name}` : 'Choose Image File (Max 10MB)'}
              </label>
              <input 
                type="file" 
                id="file-input" 
                className="file-input"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Name Input */}
          <div className="form-group">
            <label className="form-label">Awardee Name</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="Enter awardee's full name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Prize Input */}
          <div className="form-group">
            <label className="form-label">Prize Name</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="Enter prize/award name" 
              value={prizeName} 
              onChange={(e) => setPrizeName(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button 
            className="submit-button" 
            onClick={handleAdd}
            disabled={!isFormValid || uploading}
          >
            {uploading ? (
              <>
                <span>🔄</span>
                Uploading to Cloudinary...
              </>
            ) : (
              <>
                <span>🏆</span>
                Add Award
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Awards;