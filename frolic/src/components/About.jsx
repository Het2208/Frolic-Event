import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/About.css';

import Navbar from './Navbar';

export default function About() {
    return (
        <>
            <Navbar />

            <main className="py-5 container">
                <div className="row justify-content-center text-center">
                    <div className="col-lg-10">
                        <div className="content-box">
                            <h2 className="fw-bold mb-4" style={{ color: 'var(--floric-blue)' }}>The Frolic Event</h2>
                            <p className="lead">
                                Frolic is National Level Technical Symposium where talent meets opportunity. Technical fests
                                should be an essential part of course curriculum as it gives a platform to young brains to
                                showcase their innovative ideas and compete with their peers.
                            </p>
                        </div>

                        <div className="content-box">
                            <h3 className="fw-bold mb-3" style={{ color: 'var(--floric-accent)' }}>The Spirit of Innovation</h3>
                            <p className="lead mb-0">
                                These technical fests are an amalgamation of fun and learning where spectacular ideas are
                                displayed, and students learn and feel inspired. These events guide engineers, computer experts,
                                researchers to dream bigger and achieve them. Frolic hosts technical competitions and events
                                covering all areas of engineering are organized every year in the first week of September, where
                                students participate enthusiastically to make the Tech-Fest a success.
                            </p>
                        </div>

                        <div className="mt-5">
                            <h2 className="fw-bold mb-4" style={{ color: 'var(--floric-blue)' }}>Everything You Need to Know</h2>
                            <div className="accordion mx-auto shadow-sm" id="aboutAccordion"
                                style={{ maxWidth: '850px', textAlign: 'left' }}>

                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#a1">
                                            When is the event?
                                        </button>
                                    </h2>
                                    <div id="a1" className="accordion-collapse collapse" data-bs-parent="#aboutAccordion">
                                        <div className="accordion-body">
                                            The mega event is scheduled for <strong>26 September 2026</strong>. Technical fests
                                            are typically organized annually during the first week of September.
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#a2">
                                            Where is it taking place?
                                        </button>
                                    </h2>
                                    <div id="a2" className="accordion-collapse collapse" data-bs-parent="#aboutAccordion">
                                        <div className="accordion-body">
                                            The venue for FLORIC 2026 is <strong>Darshan University, Rajkot</strong>,
                                            specifically located on the Rajkot-Morbi Highway, Gujarat.
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#a3">
                                            What should students bring?
                                        </button>
                                    </h2>
                                    <div id="a3" className="accordion-collapse collapse" data-bs-parent="#aboutAccordion">
                                        <div className="accordion-body">
                                            You must bring your <strong>College ID card</strong> and a printed or digital copy
                                            of your <strong>Registration Confirmation</strong>. Individual event detail pages
                                            will list specific technical requirements.
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="text-center">
                <div className="container py-4">
                    <h5 className="fw-bold" style={{ color: 'var(--floric-blue)' }}>FROLIC 2026</h5>
                    <p className="small opacity-75 mb-0">&copy; 2026 Frolic Event.</p>
                </div>
            </footer>
        </>
    );
}