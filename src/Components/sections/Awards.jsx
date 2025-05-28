import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase' // adjust path as needed
import AwardCard from './AwardCard';
import './Awards.css';

const Awards = () => {
  const [awards, setAwards] = useState([]);
  const [name, setName] = useState('');
  const [prizeName, setPrizeName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
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

    fetchAwards();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
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
      // Upload image
      const imageRef = ref(storage, `awards/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      // Add to database
      await addDoc(collection(db, 'award_prize'), {
        name: name.trim(),
        prize_name: prizeName.trim(),
        image_link: imageUrl,
        created_at: new Date().toISOString()
      });

      // Reset form
      setName('');
      setPrizeName('');
      setImageFile(null);
      document.getElementById("file-input").value = null;

      // Refresh awards list
      const querySnapshot = await getDocs(collection(db, 'award_prize'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAwards(data);

      alert('Award added successfully!');
    } catch (error) {
      console.error('Error adding award:', error);
      alert('Error adding award. Please try again.');
    } finally {
      setUploading(false);
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
                {imageFile ? `Selected: ${imageFile.name}` : 'Choose Image File'}
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
                Adding Award...
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