import React, { useState } from 'react';
import './GallerySection.css';

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    // Extended image collection with 30+ photos
    const images = [
        { id: 1, src: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=400&fit=crop', alt: 'Family gathering' },
        { id: 2, src: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600&h=400&fit=crop', alt: 'Family portrait' },
        { id: 3, src: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=400&fit=crop', alt: 'Beach sunset' },
        { id: 4, src: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop', alt: 'Father and child' },
        { id: 5, src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop', alt: 'Ocean waves' },
        { id: 6, src: 'https://images.unsplash.com/photo-1607048837138-49d6a20fdc0c?w=600&h=400&fit=crop', alt: 'Friends group' },
        { id: 7, src: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=600&h=400&fit=crop', alt: 'Music equipment' },
        { id: 8, src: 'https://images.unsplash.com/photo-1577062779674-7d0b13e60bb8?w=800&h=600&fit=crop', alt: 'Main family photo' },
        { id: 9, src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop', alt: 'Family time' },
        { id: 10, src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop', alt: 'Delicious burger' },
        { id: 11, src: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop', alt: 'Food spread' },
        { id: 12, src: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=400&fit=crop', alt: 'Silhouettes at sunset' },
        { id: 13, src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop', alt: 'Workout session' },
        { id: 14, src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop', alt: 'Cooking together' },
        { id: 15, src: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop', alt: 'Happy family' },
        { id: 16, src: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=400&fit=crop', alt: 'Children playing' },
        { id: 17, src: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&h=400&fit=crop', alt: 'Family picnic' },
        { id: 18, src: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&h=400&fit=crop', alt: 'Birthday celebration' },
        { id: 19, src: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop', alt: 'Graduation day' },
        { id: 20, src: 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?w=600&h=400&fit=crop', alt: 'Wedding moments' },
        { id: 21, src: 'https://images.unsplash.com/photo-1567532939755-af4be2538200?w=600&h=400&fit=crop', alt: 'Adventure time' },
        { id: 22, src: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop', alt: 'Sports activity' },
        { id: 23, src: 'https://images.unsplash.com/photo-1574391884720-bbc930c70d50?w=600&h=400&fit=crop', alt: 'Music performance' },
        { id: 24, src: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=400&fit=crop', alt: 'Art creation' },
        { id: 25, src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop', alt: 'Nature walk' },
        { id: 26, src: 'https://images.unsplash.com/photo-1607048837138-49d6a20fdc0c?w=600&h=400&fit=crop', alt: 'Beach vacation' },
        { id: 27, src: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=600&h=400&fit=crop', alt: 'Festival fun' },
        { id: 28, src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop', alt: 'Holiday gathering' },
        { id: 29, src: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop', alt: 'Travel memories' },
        { id: 30, src: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=400&fit=crop', alt: 'Special moments' },
        { id: 31, src: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop', alt: 'Family bonding' },
        { id: 32, src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop', alt: 'Cultural celebration' },
        { id: 33, src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop', alt: 'Cultural celebration' }
    ];

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

    return (
        <div className="gallery-container">
            <div className="gallery-header">
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
                                onClick={() => downloadImage(selectedImage.src, `image-${selectedImage.id}.jpg`)}
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