import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import '../CSS/AdminDashboard.css';

export default function AdminDashboard() {
    const { toggleSidebar } = useOutletContext();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/dashboard/stats");
                if (res.data.success) {
                    setStats(res.data.data);
                }
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Color palette to make the bar chart vibrant
    const COLORS = ['#0d6efd', '#6f42c1', '#d63384', '#fd7e14', '#198754', '#ffc107'];

    // Convert object data to chart-friendly array format
    const chartData = stats ? [
        { name: 'Institutes', count: stats.Institutes || 0, color: COLORS[0] },
        { name: 'Departments', count: stats.Departments || 0, color: COLORS[1] },
        { name: 'Events', count: stats.Events || 0, color: COLORS[2] },
        { name: 'Participants', count: stats.Participants || 0, color: COLORS[3] },
        { name: 'Groups', count: stats.Groups || 0, color: COLORS[4] },
        { name: 'Winners', count: stats.Winners || 0, color: COLORS[5] }
    ] : [];

    return (
        <>

            <header className="mb-4 d-flex align-items-center">
                <button className="btn btn-menu me-3" onClick={toggleSidebar}>
                    <i className="bi bi-list fs-4"></i>
                </button>
                <h2 className="fw-bold mb-0">Admin Dashboard</h2>
            </header>

            <h4 className="fw-bold mb-3 analytics-title">Analytics Overview</h4>

            {loading ? (
                <div className="d-flex justify-content-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="row g-4 mb-5">
                        {[
                            { label: 'Institutes', count: stats?.Institutes || 0, icon: 'bi-bank', path: '/admin/institutes' },
                            { label: 'Departments', count: stats?.Departments || 0, icon: 'bi-building', path: '/admin/departments' },
                            { label: 'Events', count: stats?.Events || 0, icon: 'bi-calendar-event', path: '/admin/events' },
                            { label: 'Participants', count: stats?.Participants || 0, icon: 'bi-people', path: '/admin/participants' },
                            { label: 'Groups', count: stats?.Groups || 0, icon: 'bi-microsoft-teams', path: '/admin/groups' },
                            { label: 'Winners', count: stats?.Winners || 0, icon: 'bi-trophy', path: '/admin/winners' }
                        ].map((stat, idx) => (
                            <div key={idx} className="col-md-4 col-lg-2">
                                <Link to={stat.path} className="stat-link">
                                    <div className="stat-card">
                                        <div className="icon-box"><i className={`bi ${stat.icon}`}></i></div>
                                        <div className="stat-number">{stat.count}</div>
                                        <div className="stat-label">{stat.label}</div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="row mt-4">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm rounded-4 p-4">
                                <h5 className="fw-bold mb-4 text-secondary">System Distribution Graph</h5>
                                <div style={{ width: '100%', height: 400 }}>
                                    <ResponsiveContainer>
                                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 13 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 13 }} dx={-10} />
                                            <Tooltip
                                                cursor={{ fill: '#F3F4F6' }}
                                                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                            />
                                            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}