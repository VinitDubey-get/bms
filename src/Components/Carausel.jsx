import React, { useState, useEffect, useRef } from 'react';
import './Carausel.css';

const Carousel = ({ 
    title = "Recent Award Winners",
    images = [],
    autoSlideInterval = 4000,
    showControls = true,
    showIndicators = true 
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const trackRef = useRef(null);
    const autoSlideRef = useRef(null);

    // Default images if none provided
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

    const slideImages = images.length > 0 ? images : defaultImages;
    const totalSlides = slideImages.length;

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
        if (!isHovered) {
            startAutoSlide();
        } else {
            stopAutoSlide();
        }

        return () => stopAutoSlide();
    }, [isHovered, autoSlideInterval]);

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

    return (
        <div className="carousel-container">
            <h1 className="carousel-title">{title}</h1>
            
            <div 
                className="carousel-wrapper"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {showControls && (
                    <>
                        <button 
                            className="carousel-controls prev-btn" 
                            onClick={previousSlide}
                            aria-label="Previous slide"
                        >
                            ❮
                        </button>
                        <button 
                            className="carousel-controls next-btn" 
                            onClick={nextSlide}
                            aria-label="Next slide"
                        >
                            ❯
                        </button>
                    </>
                )}
                
                <div className="carousel-track" ref={trackRef}>
                    {slideImages.map((image, index) => (
                        <div 
                            key={image.id || index}
                            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                        >
                            <div className="award-card">
                                <img 
                                    src={image.src} 
                                    alt={image.alt || `Award Winner ${index + 1}`}
                                    className="award-image"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTgwSDIyNVYyMjBIMTc1VjE4MFoiIGZpbGw9IiNEMUQ1REIiLz4KPHA+PHRleHQgeD0iMjAwIiB5PSIyNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Q0E0QUYiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3A+Cjwvc3ZnPgo=';
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {showIndicators && (
                <div className="carousel-indicators">
                    {slideImages.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${index === currentSlide ? 'active' : ''}`}
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