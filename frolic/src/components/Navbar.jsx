import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../CSS/Navbar.css';

export default function Navbar() {
    const { isAuthenticated, user, role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    // Enforce light theme
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }, []);

    return (
        <nav className="navbar navbar-expand-lg sticky-top custom-nav">
            <div className="container">
                <span className="navbar-brand-text">FROLIC</span>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="mainNav">
                    <ul className="navbar-nav mx-auto align-items-center">
                        <li className="nav-item"><Link className="nav-link fw-bold" to="/home">Home</Link></li>
                        <li className="nav-item"><Link className="nav-link fw-bold" to="/events">Event</Link></li>
                        <li className="nav-item"><Link className="nav-link fw-bold" to="/gallery">Gallery</Link></li>
                        <li className="nav-item"><Link className="nav-link fw-bold" to="/about">What is FLORIC?</Link></li>
                        <li className="nav-item"><Link className="nav-link fw-bold" to="/contact">Contact Us</Link></li>
                    </ul>

                    <div className="d-flex align-items-center">
                        {isAuthenticated ? (
                            <div className="nav-item dropdown profile-dropdown-hover">
                                <a className="profile-toggle-link dropdown-toggle d-flex align-items-center" href="#" role="button" aria-expanded="false" style={{ gap: '8px', cursor: 'pointer', textDecoration: 'none', color: 'inherit', padding: '0.5rem 1rem' }}>
                                    <i className="bi bi-person-circle fs-4" style={{ color: "var(--floric-blue, #0d6efd)" }}></i>
                                    <span className="fw-bold">{user?.name || "User"}</span>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-0">
                                    <li><button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                                    </button></li>
                                </ul>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-login">Login</Link>
                        )}
                    </div>
                </div>
            </div>
            <style>
                {`
                .profile-dropdown-hover:hover .dropdown-menu {
                    display: block;
                }
                `}
            </style>
        </nav>
    );
}
