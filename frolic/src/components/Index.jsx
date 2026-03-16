import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/index.css';

import Navbar from './Navbar';

export default function Page() {
    return (
        <div className="page-wrapper">
            <Navbar />

            <header className="hero-banner">
                <div className="container">
                    <div className="hero-glass-card mx-auto" style={{ maxWidth: '800px' }}>
                        <h1 className="display-2 fw-bold mb-3" style={{ letterSpacing: '-2px' }}>FROLIC 2026</h1>
                        <p className="fs-5 mb-5 opacity-75">
                            Join the ultimate digital stage for innovation and talent. Bringing
                            together every college student across Gujarat.
                        </p>

                        <div className="d-flex flex-wrap justify-content-center gap-4 mb-5">
                            <div className="info-pill">
                                <small className="d-block opacity-50 text-uppercase fw-bold">Date</small>
                                <span className="fs-5 fw-bold">26 Sept 2026</span>
                            </div>
                            <div className="info-pill">
                                <small className="d-block opacity-50 text-uppercase fw-bold">Venue</small>
                                <span className="fs-5 fw-bold">Darshan University, Rajkot</span>
                            </div>
                        </div>
                        <Link to="/register" className="register-btn">Register Now!!</Link>
                    </div>
                </div>
            </header>

            <section id="about" className="container my-5 py-5">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <h2 className="fw-bold" style={{ color: 'var(--floric-blue)' }}>Detail about frolic : </h2>
                        <p className="mt-3 lead">
                            Frolic is National Level Technical Symposium where talent meets opportunity.
                            Technical fests should be an essential part of course curriculum as it gives a platform to young
                            brains to showcase their innovative ideas and compete with their peers.
                            <br /><br />
                            These technical fests are an amalgamation of fun and learning where spectacular ideas are displayed,
                            and students learn and feel inspired. These events guide engineers, computer experts, researchers to
                            dream bigger and achieve them. Frolic hosts technical competitions and events covering all areas of
                            engineering are organized every year in the first week of September, where students participate
                            enthusiastically to make the Tech-Fest a success.
                        </p>
                    </div>
                </div>
            </section>

            <footer className="text-center">
                <div className="container py-4">
                    <p className="mb-1 fw-bold" style={{ color: 'var(--floric-blue)' }}>FROLIC 2026</p>
                    <p className="small mb-0 opacity-75">&copy; 2026 Frolic Event.</p>
                </div>
            </footer>
        </div>
    );
}