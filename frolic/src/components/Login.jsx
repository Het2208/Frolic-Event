import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../CSS/Login.css'; // Importing your existing CSS file
import Navbar from './Navbar';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    // State management for form fields and validation errors
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email: false,
        pass: false,
        server: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const validateAndLogin = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        const isEmailValid = emailRegex.test(formData.email);
        const isPassValid = formData.password.length > 0;

        // Update error visibility state
        setErrors({
            email: !isEmailValid,
            pass: !isPassValid,
            server: ''
        });

        if (isEmailValid && isPassValid) {
            try {
                const response = await axios.post('http://localhost:5000/api/login', {
                    email: formData.email,
                    password: formData.password
                });

                if (response.data.success) {
                    // Update auth context
                    login(response.data.token, response.data.user);
                    // Redirect based on role
                    if (response.data.user.role === 'admin') {
                        navigate('/admin/dashboard');
                    } else {
                        navigate('/home');
                    }
                }
            } catch (err) {
                setErrors(prev => ({
                    ...prev,
                    server: err.response?.data?.message || "Login failed. Please try again."
                }));
            }
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-wrapper">
                <div className="text-logo">FROLIC</div>

                <div className="login-card">
                    <h4 className="text-center mb-3" style={{ color: 'var(--floric-blue)', fontWeight: 700 }}>
                        Account Login
                    </h4>

                    <form id="loginForm">
                        {errors.server && (
                            <div className="alert alert-danger" role="alert">
                                {errors.server}
                            </div>
                        )}
                        <div className="mb-2">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                placeholder="Enter Email-ID"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <div className="error-text" style={{ display: errors.email ? 'block' : 'none' }}>
                                Enter a valid email.
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                placeholder="Enter Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <div className="error-text" style={{ display: errors.pass ? 'block' : 'none' }}>
                                Need 8+ chars, Uppercase & Special.
                            </div>
                        </div>

                        <button type="button" onClick={validateAndLogin} className="btn btn-floric">
                            Login Now
                        </button>

                        <p className="register-text">
                            New here? <Link to="/register">Create an account</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}