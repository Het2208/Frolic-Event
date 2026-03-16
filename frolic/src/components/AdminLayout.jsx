import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../CSS/SharedSidebar.css';

export default function AdminLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Initialize theme and sidebar state
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        setIsDarkMode(savedTheme === 'dark');

        const savedSidebarState = localStorage.getItem('sidebar_collapsed');
        if (savedSidebarState === 'true') {
            setIsCollapsed(true);
        }
    }, []);

    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('sidebar_collapsed', newState.toString());
    };

    const toggleTheme = () => {
        const newTheme = !isDarkMode ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        setIsDarkMode(!isDarkMode);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/login');
    };

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} id="sidebar">
                <div className="sidebar-header text-center">
                    <Link to="/admin/dashboard" className="navbar-brand-text">FROLIC</Link>
                </div>

                <div className="user-profile mb-4">
                    <div className="d-flex align-items-center p-2 rounded profile-container">
                        <img
                            src="https://ui-avatars.com/api/?name=Admin+User&background=005096&color=fff"
                            className="rounded-circle me-2"
                            width="35"
                            alt="Admin"
                        />
                        <div className="profile-text">
                            <p className="mb-0 fw-bold small">Admin User</p>
                            <p className="mb-0 text-muted" style={{ fontSize: '0.7rem' }}>Super Admin</p>
                        </div>
                    </div>
                </div>

                <nav className="nav flex-column px-2">
                    <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/admin/dashboard">
                        <i className="bi bi-speedometer2 me-2"></i> <span>Dashboard</span>
                    </NavLink>
                    <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/admin/institutes">
                        <i className="bi bi-bank me-2"></i> <span>Institutes</span>
                    </NavLink>
                    <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/admin/departments">
                        <i className="bi bi-building me-2"></i> <span>Departments</span>
                    </NavLink>
                    <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/admin/events">
                        <i className="bi bi-calendar-event me-2"></i> <span>Events</span>
                    </NavLink>
                    <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/admin/participants">
                        <i className="bi bi-people me-2"></i> <span>Participants</span>
                    </NavLink>
                    <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/admin/groups">
                        <i className="bi bi-microsoft-teams me-2"></i> <span>Groups</span>
                    </NavLink>
                    <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/admin/winners">
                        <i className="bi bi-trophy me-2"></i> <span>Winners</span>
                    </NavLink>
                </nav>

                <div className="mt-auto px-3 pb-4">
                    <div className="theme-switch-wrapper">
                        <label className="theme-switch" htmlFor="checkbox">
                            <input
                                type="checkbox"
                                id="checkbox"
                                checked={isDarkMode}
                                onChange={toggleTheme}
                            />
                            <div className="slider">
                                <span className="mode-icon">🌙</span>
                                <span className="mode-icon">☀️</span>
                            </div>
                        </label>
                        <span className="ms-2 small theme-label">
                            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                        </span>
                    </div>

                    <a href="#" onClick={handleLogout} className="nav-link text-danger border-top pt-3 rounded-0 mt-3">
                        <i className="bi bi-box-arrow-left me-2"></i> <span>Logout</span>
                    </a>
                </div>
            </div>

            {/* Main Content Wrapper */}
            <div className={`main-content ${isCollapsed ? 'expanded' : ''}`} id="mainContent">
                <Outlet context={{ toggleSidebar }} />
            </div>
        </div>
    );
}
