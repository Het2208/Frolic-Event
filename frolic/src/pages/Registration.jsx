import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../CSS/Login.css'; // Importing existing form CSS structure

export default function Registration() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        UserName: '',
        EmailAddress: '',
        PhoneNumber: '',
        UserPassword: '',
        confirmPassword: '',
        IsAdmin: false
    });

    const [errors, setErrors] = useState({
        UserName: false,
        EmailAddress: false,
        PhoneNumber: false,
        UserPassword: false,
        confirmPassword: false,
        server: ''
    });

    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        // Clear server errors when they type
        setErrors(prev => ({ ...prev, server: '' }));
    };

    const validateAndRegister = async () => {
        const isUserValid = formData.UserName.trim().length > 0;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailRegex.test(formData.EmailAddress);
        const isPhoneValid = formData.PhoneNumber.trim().length > 0;
        const isPassValid = formData.UserPassword.length >= 6; // Basic minimum length validation
        const isConfirmMatch = formData.UserPassword === formData.confirmPassword && formData.UserPassword.length > 0;

        setErrors({
            UserName: !isUserValid,
            EmailAddress: !isEmailValid,
            PhoneNumber: !isPhoneValid,
            UserPassword: !isPassValid,
            confirmPassword: !isConfirmMatch,
            server: ''
        });

        if (isUserValid && isEmailValid && isPhoneValid && isPassValid && isConfirmMatch) {
            try {
                const payload = {
                    UserName: formData.UserName,
                    UserPassword: formData.UserPassword, // Requirements stipulate sending plain password
                    EmailAddress: formData.EmailAddress,
                    PhoneNumber: formData.PhoneNumber,
                    IsAdmin: false
                };

                // Using existing user creation API verified in server.js
                const res = await axios.post("http://localhost:5000/api/user/add", payload);
                if (res.data.success) {
                    setSuccessMessage("Registration Successful! Redirecting to login...");
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                }
            } catch (err) {
                // Determine source of error (email exists, server issue, etc)
                const message = err.response?.data?.message || err.message || "Server configuration error";
                setErrors(prev => ({ ...prev, server: message }));
            }
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-wrapper">
                <div className="text-logo">FROLIC</div>

                <div className="login-card" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                    <h4 className="text-center mb-3" style={{ color: 'var(--floric-blue)', fontWeight: 700 }}>
                        Create an Account
                    </h4>

                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errors.server && <div className="alert alert-danger">{errors.server}</div>}

                    <form id="registrationForm">
                        <div className="mb-2">
                            <label className="form-label">User Name</label>
                            <input type="text" id="UserName" className="form-control" placeholder="Enter Full Name" value={formData.UserName} onChange={handleChange} />
                            <div className="error-text" style={{ display: errors.UserName ? 'block' : 'none' }}>
                                User Name is required.
                            </div>
                        </div>

                        <div className="mb-2">
                            <label className="form-label">Email Address</label>
                            <input type="email" id="EmailAddress" className="form-control" placeholder="Enter Email Address" value={formData.EmailAddress} onChange={handleChange} />
                            <div className="error-text" style={{ display: errors.EmailAddress ? 'block' : 'none' }}>
                                Enter a valid email format.
                            </div>
                        </div>

                        <div className="mb-2">
                            <label className="form-label">Phone Number</label>
                            <input type="text" id="PhoneNumber" className="form-control" placeholder="Enter Phone Number" value={formData.PhoneNumber} onChange={handleChange} />
                            <div className="error-text" style={{ display: errors.PhoneNumber ? 'block' : 'none' }}>
                                Phone Number is required.
                            </div>
                        </div>

                        <div className="mb-2">
                            <label className="form-label">Password</label>
                            <input type="password" id="UserPassword" className="form-control" placeholder="Enter Password" value={formData.UserPassword} onChange={handleChange} />
                            <div className="error-text" style={{ display: errors.UserPassword ? 'block' : 'none' }}>
                                Password must be at least 6 characters.
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Confirm Password</label>
                            <input type="password" id="confirmPassword" className="form-control" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
                            <div className="error-text" style={{ display: errors.confirmPassword ? 'block' : 'none' }}>
                                Passwords must match exactly.
                            </div>
                        </div>

                        <button type="button" onClick={validateAndRegister} className="btn btn-floric">
                            Register
                        </button>

                        <p className="register-text mt-3">
                            Already have an account? <Link to="/login">Login here</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
