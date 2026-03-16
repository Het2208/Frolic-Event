import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Contact.css';
import Navbar from './Navbar';

export default function Contact() {
    const validateAndSend = () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const query = document.getElementById('query').value;

        const nameRegex = /^[a-zA-Z ]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let isValid = true;

        // Reset error messages via DOM (or you could use state for a more 'React' approach)
        document.querySelectorAll('.error-msg').forEach(e => e.style.display = 'none');

        if (!nameRegex.test(name)) {
            document.getElementById('nameError').style.display = 'block';
            isValid = false;
        }
        if (!emailRegex.test(email)) {
            document.getElementById('emailError').style.display = 'block';
            isValid = false;
        }
        if (query.trim().length < 10) {
            document.getElementById('queryError').style.display = 'block';
            isValid = false;
        }

        if (isValid) {
            alert("Thank you! Your inquiry has been submitted successfully.");
            document.getElementById('contactForm').reset();
        }
    };

    return (
        <div className="main-viewport">
            <Navbar />

            <main className="contact-content">
                <div className="container d-flex flex-column align-items-center">
                    <div className="direct-contact-bar">
                        <a href="mailto:frolic@darshan.ac.in" className="contact-pill">
                            <span>📩</span> frolic@darshan.ac.in
                        </a>
                        <a href="tel:+919876543210" className="contact-pill">
                            <span>📞</span> 98765 43210
                        </a>
                    </div>

                    <div className="contact-card shadow-lg">
                        <h3 className="text-center fw-bold mb-4" style={{ color: 'var(--floric-blue)' }}>Inquiry Form</h3>
                        <form id="contactForm" className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="name">Full Name *</label>
                                <input type="text" id="name" className="form-control" placeholder="Your Full Name" required />
                                <div id="nameError" className="error-msg">Letters only please.</div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="username">Username</label>
                                <input type="text" id="username" className="form-control" placeholder="User ID" />
                                <div id="userError" className="error-msg">6+ chars & 1 digit required.</div>
                            </div>
                            <div className="col-12">
                                <label className="form-label" htmlFor="email">Email ID *</label>
                                <input type="email" id="email" className="form-control" placeholder="Enter your Email-ID" required />
                                <div id="emailError" className="error-msg">Enter a valid email address.</div>
                            </div>
                            <div className="col-12">
                                <label className="form-label" htmlFor="query">Query Description *</label>
                                <textarea id="query" className="form-control" rows="3" placeholder="Describe your query..." required></textarea>
                                <div id="queryError" className="error-msg">Minimum 10 characters required.</div>
                            </div>
                            <div className="col-12">
                                <button type="button" onClick={validateAndSend} className="submit-btn">Submit Inquiry</button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <footer className="text-center">
                <div className="container">
                    <p className="mb-1 fw-bold" style={{ color: 'var(--floric-blue)' }}>FROLIC 2026</p>
                    <p className="small mb-0 opacity-75">&copy; 2026 Frolic Event</p>
                </div>
            </footer>
        </div>
    );
}