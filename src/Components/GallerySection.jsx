import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the import path to your Firebase config
import './GallerySection.css';

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch images from Firebase Firestore
    useEffect(() => {
        const fetchImages = async () => {
            try {
                setLoading(true);
                const querySnapshot = await getDocs(collection(db, 'gallery'));
                const imageData = [];
                
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    imageData.push({
                        id: doc.id,
                        src: data.image_link,
                        alt: data.heading
                    });
                });
                
                setImages(imageData);
                setError(null);
            } catch (err) {
                console.error('Error fetching images:', err);
                setError('Failed to load images');
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