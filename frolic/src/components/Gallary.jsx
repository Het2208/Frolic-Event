import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Gallary.css';

import Navbar from './Navbar';

export default function Gallery() {
    return (
        <>
            <Navbar />

            <section className="showcase-header">
                <div className="showcase-overlay">
                    <h1 className="display-3 fw-bold">Captured Moments</h1>
                </div>
                <div id="galleryCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="3000">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src="../Images/hero1.jpg" className="d-block w-100" alt="Slide 1" />
                        </div>
                        <div className="carousel-item">
                            <img src="../Images/hero2.jpg" className="d-block w-100" alt="Slide 2" />
                        </div>
                        <div className="carousel-item">
                            <img src="../Images/hero3.jpg" className="d-block w-100" alt="Slide 3" />
                        </div>
                    </div>
                </div>
            </section>

            <div className="container py-5">
                <h2 className="text-center fw-bold mb-5" style={{ color: 'var(--floric-blue)' }}>Event Highlights</h2>
                <div className="row g-4">
                    <div className="col-md-4 col-sm-6">
                        <div className="gallery-card">
                            <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..." alt="Highlight 1" />
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6">
                        <div className="gallery-card">
                            <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..." alt="Highlight 2" />
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6">
                        <div className="gallery-card">
                            <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..." alt="Highlight 3" />
                        </div>
                    </div>
                </div>
            </div>

            <footer className="text-center">
                <div className="container">
                    <h5 className="fw-bold" style={{ color: 'var(--floric-blue)' }}>FROLIC 2026</h5>
                    <p className="small opacity-75 mb-0">&copy; 2026 Frolic Event.</p>
                </div>
            </footer>
        </>
    );
}