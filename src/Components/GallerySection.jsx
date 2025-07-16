import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase'; 
import './GallerySection.css';

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch images from Firebase Firestore - newest first
    useEffect(() => {
        const fetchImages = async () => {
            try {
                setLoading(true);
                
                // Create query to order by created_at in descending order (newest first)
                const q = query(
                    collection(db, 'gallery'),
                    orderBy('created_at', 'desc')
                );
                
                const querySnapshot = await getDocs(q);
                const imageData = [];
                
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    imageData.push({
                        id: doc.id,
                        src: data.image_link,
                        alt: data.heading,
                        created_at: data.created_at,
                        // Include other fields if needed
                        file_size: data.file_size,
                        file_type: data.file_type,
                        height: data.height,
                        width: data.width
                    });
                });
                
                setImages(imageData);
                setError(null);
            } catch (err) {
                console.error('Error fetching images:', err);
                
                // If ordering fails (e.g., no index), fallback to basic query
                if (err.code === 'failed-precondition') {
                    console.log('Firestore index not found, falling back to basic query');
                    try {
                        const basicQuery = await getDocs(collection(db, 'gallery'));
                        const imageData = [];
                        
                        basicQuery.forEach((doc) => {
                            const data = doc.data();
                            imageData.push({
                                id: doc.id,
                                src: data.image_link,
                                alt: data.heading,
                                created_at: data.created_at,
                                file_size: data.file_size,
                                file_type: data.file_type,
                                height: data.height,
                                width: data.width
                            });
                        });
                        
                        // Sort manually by created_at if it exists
                        const sortedImages = imageData.sort((a, b) => {
                            if (a.created_at && b.created_at) {
                                // Handle both Firestore Timestamp and regular Date objects
                                const dateA = a.created_at.toDate ? a.created_at.toDate() : new Date(a.created_at);
                                const dateB = b.created_at.toDate ? b.created_at.toDate() : new Date(b.created_at);
                                return dateB - dateA; // Newest first
                            }
                            return 0;
                        });
                        
                        setImages(sortedImages);
                        setError(null);
                    } catch (fallbackErr) {
                        console.error('Fallback query also failed:', fallbackErr);
                        setError('Failed to load images');
                    }
                } else {
                    setError('Failed to load images');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    const openOverlay = (image) => {
        setSelectedImage(image);
    };

    const closeOverlay = () => {
        setSelectedImage(null);
    };

    const downloadImage = async (imageUrl, filename) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename || 'image.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        
        try {
            // Handle Firestore Timestamp objects
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    if (loading) {
        return (
            <div className="bms-gallery-container">
                <div className="bms-gallery-header">
                    <h1>BMS GALLERY</h1>
                </div>
                <div className="loading">Loading images...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bms-gallery-container">
                <div className="bms-gallery-header">
                    <h1>BMS GALLERY</h1>
                </div>
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <div className="bms-gallery-container">
            <div className="bms-gallery-header">
                <h1>BMS GALLERY</h1>
                <p className="gallery-subtitle">
                    {images.length} images
                </p>
            </div>

            <div className="gallery-frame">
                <div className="gallery-grid">
                    {images.map((image, index) => (
                        <div
                            key={image.id}
                            className={`gallery-item ${index === 7 ? 'main-image' : ''}`}
                            onClick={() => openOverlay(image)}
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                loading="lazy"
                            />
                            {index === 7 && (
                                <div className="family-text">
                                    <span>Family</span>
                                </div>
                            )}
                            {/* Optional: Show upload date on hover */}
                            <div className="image-info">
                                <span className="upload-date">
                                    {formatDate(image.created_at)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Image Overlay */}
            {selectedImage && (
                <div className="overlay" onClick={closeOverlay}>
                    <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={closeOverlay}>
                            ×
                        </button>
                        <img
                            src={selectedImage.src}
                            alt={selectedImage.alt}
                            className="overlay-image"
                        />
                        <div className="overlay-info">
                            <h3>{selectedImage.alt}</h3>
                            <p>Uploaded: {formatDate(selectedImage.created_at)}</p>
                            {selectedImage.file_size && (
                                <p>Size: {(selectedImage.file_size / 1024).toFixed(2)} KB</p>
                            )}
                            {selectedImage.width && selectedImage.height && (
                                <p>Dimensions: {selectedImage.width} × {selectedImage.height}</p>
                            )}
                        </div>
                        <div className="overlay-controls">
                            <button
                                className="download-btn"
                                onClick={() => downloadImage(selectedImage.src, `${selectedImage.alt || 'image'}.jpg`)}
                            >
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;