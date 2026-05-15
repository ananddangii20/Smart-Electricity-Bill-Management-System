import { useState, useEffect } from 'react';
import '../styles/HeroCarousel.css';

const HeroCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoplay, setIsAutoplay] = useState(true);

const slides = [
    {
        image: 'https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        title: 'Real-Time Billing & Secure Payments',
        subtitle: 'Smart Energy Platform',
        description: 'Built for modern Indian electricity consumers and utility providers.',
    },
    {
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop',
        title: 'Monitor Energy Consumption',
        subtitle: 'Efficient Usage Tracking',
        description: 'Track your electricity usage in real-time with detailed analytics.',
    },
    {
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
        title: 'Seamless Payment Processing',
        subtitle: 'Secure & Fast Transactions',
        description: 'Experience quick and secure online payments with multiple options.',
    },
    {
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop',
        title: 'Smart Meter Technology',
        subtitle: 'Advanced IoT Integration',
        description: 'Latest smart meter technology for accurate readings and monitoring.',
    },
];

    useEffect(() => {
        if (!isAutoplay) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [isAutoplay, slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAutoplay(false);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setIsAutoplay(false);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoplay(false);
    };

    return (
        <div className="hero-carousel-container">
            <div className="carousel-wrapper">
                {/* Slides */}
                <div className="carousel-slides">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`carousel-slide ${index === currentSlide ? 'active' : ''
                                }`}
                        >
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="slide-image"
                            />
                            <div className="slide-overlay"></div>
                            <div className="slide-content">
                                <p className="slide-subtitle">{slide.subtitle}</p>
                                <h2 className="slide-title">{slide.title}</h2>
                                <p className="slide-description">
                                    {slide.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <button
                    className="carousel-btn prev-btn"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>

                <button
                    className="carousel-btn next-btn"
                    onClick={nextSlide}
                    aria-label="Next slide"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>

                {/* Dots Navigation */}
                <div className="carousel-dots">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        ></button>
                    ))}
                </div>

                {/* Autoplay Indicator */}
                <div className="autoplay-control">
                    <button
                        onClick={() => setIsAutoplay(!isAutoplay)}
                        className="autoplay-btn"
                        title={isAutoplay ? 'Pause autoplay' : 'Resume autoplay'}
                    >
                        {isAutoplay ? '⏸' : '▶'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroCarousel;
