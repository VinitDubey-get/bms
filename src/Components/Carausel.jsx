import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust path to your Firebase config
import './Carausel.css';

const Carousel = ({ 
    title = "Recent Events & Awards",
    autoSlideInterval = 2000,
    showControls = true,
    showIndicators = true 
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const trackRef = useRef(null);
    const autoSlideRef = useRef(null);

    // Default fallback images if Firebase fails
    const defaultImages = [
        {
            id: 1,
            src: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&h=400&fit=crop&crop=center",
            alt: "Award Winner 1"
        },
        {
            id: 2,
            src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=400&fit=crop&crop=center",
            alt: "Award Winner 2"
        },
        {
            id: 3,
            src: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=400&fit=crop&crop=center",
            alt: "Award Winner 3"
        },
        {
            id: 4,
            src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop&crop=center",
            alt: "Award Winner 4"
        },
        {
            id: 5,
            src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&crop=center",
            alt: "Award Winner 5"
        }
    ];

    // Fetch images from Firebase Firestore
    const fetchImagesFromFirestore = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Create query to get top 5 images from gallery collection
            // Ordered by created_at in descending order (most recent first)
            const q = query(
                collection(db, 'gallery'),
                orderBy('created_at', 'desc'),
                limit(6)
            );
            
            const querySnapshot = await getDocs(q);
            const fetchedImages = [];
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedImages.push({
                    id: doc.id,
                    src: data.image_link || data.url || data.src, // Handle different field names
                    alt: data.alt || data.heading || data.title || `Gallery Image ${fetchedImages.length + 1}`,
                    ...data // Include all other data if needed
                });
            });
            
            if (fetchedImages.length > 0) {
                setImages(fetchedImages);
            } else {
                // If no images found, use default images
                setImages(defaultImages);
            }
        } catch (err) {
            console.error('Error fetching images from Firestore:', err);
            setError(err.message);
            // Fallback to default images on error
            setImages(defaultImages);
        } finally {
            setLoading(false);
        }
    };

    // Fetch images on component mount
    useEffect(() => {
        fetchImagesFromFirestore();
    }, []);

    const totalSlides = images.length;

    const updateCarousel = () => {
        if (trackRef.current) {
            const slideWidth = 340; // 300px + 40px margin
            const offset = currentSlide * slideWidth;
            trackRef.current.style.transform = `translateX(-${offset}px)`;
        }
    };

    const nextSlide = () => {
        const visibleSlides = Math.floor(1200 / 340); // Max container width / slide width
        const maxSlide = Math.max(0, totalSlides - visibleSlides);
        
        setCurrentSlide(prev => prev < maxSlide ? prev + 1 : 0);
    };

    const previousSlide = () => {
        const visibleSlides = Math.floor(1200 / 340);
        const maxSlide = Math.max(0, totalSlides - visibleSlides);
        
        setCurrentSlide(prev => prev > 0 ? prev - 1 : maxSlide);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const startAutoSlide = () => {
        if (autoSlideRef.current) {
            clearInterval(autoSlideRef.current);
        }
        autoSlideRef.current = setInterval(nextSlide, autoSlideInterval);
    };

    const stopAutoSlide = () => {
        if (autoSlideRef.current) {
            clearInterval(autoSlideRef.current);
        }
    };

    useEffect(() => {
        updateCarousel();
    }, [currentSlide]);

    useEffect(() => {
        if (!isHovered && !loading) {
            startAutoSlide();
        } else {
            stopAutoSlide();
        }

        return () => stopAutoSlide();
    }, [isHovered, autoSlideInterval, loading]);

    // Touch/swipe handling
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            previousSlide();
        }
    };

    // Retry function for manual refresh
    const handleRetry = () => {
        fetchImagesFromFirestore();
    };

    if (loading) {
        return (
            <div className="award-carousel-container">
                <h1 className="award-carousel-title">{title}</h1>
                <div className="award-carousel-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading images...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="award-carousel-container">
            <h1 className="award-carousel-title">{title}</h1>
            
            {error && (
                <div className="award-carousel-error">
                    <p>Error loading images: {error}</p>
                    <button onClick={handleRetry} className="retry-button">
                        Retry
                    </button>
                </div>
            )}
            
            <div 
                className="award-carousel-wrapper"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {showControls && (
                    <>
                        <button 
                            className="award-carousel-controls award-prev-btn" 
                            onClick={previousSlide}
                            aria-label="Previous slide"
                        >
                            ❮
                        </button>
                        <button 
                            className="award-carousel-controls award-next-btn" 
                            onClick={nextSlide}
                            aria-label="Next slide"
                        >
                            ❯
                        </button>
                    </>
                )}
                
                <div className="award-carousel-track" ref={trackRef}>
                    {images.map((image, index) => (
                        <div 
                            key={image.id || index}
                            className={`award-carousel-slide ${index === currentSlide ? 'active' : ''}`}
                        >
                            <div className="award-winner-card">
                                <img 
                                    src={image.src} 
                                    alt={image.alt || `Award Winner ${index + 1}`}
                                    className="award-winner-image"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTgwSDIyNVYyMjBIMTc1VjE4MFoiIGZpbGw9IiNEMUQ1REIiLz4KPHA+PHRleHQgeD0iMjAwIiB5PSIyNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Q0E0QUYiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3A+Cjwvc3ZnPgo=';
                                    }}
                                />
                                {image.heading && (
                                    <div className="award-winner-info">
                                        <h3>{image.heading}</h3>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {showIndicators && (
                <div className="award-carousel-indicators">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={`award-indicator ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Carousel;