import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useOutletContext } from 'react-router-dom';
import '../CSS/GroupListPage.css';

const GroupListPage = () => {
    const { toggleSidebar } = useOutletContext();
    const [groups, setGroups] = useState([]);
    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        GroupName: "",
        EventID: "",
        IsPaymentDone: "false",
        IsPresent: "false",
        CreatedAt: "",
        ModifiedAt: "",
        ModifiedBy: ""
    });

    useEffect(() => {
        fetchGroups();
        fetchEvents();
        fetchUsers();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/events");
            if (res.data.success) setEvents(res.data.data);
        } catch (err) { console.error("Error fetching events:", err); }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/users");
            if (res.data.success) setUsers(res.data.data);
        } catch (err) { console.error("Error fetching users:", err); }
    };

    const getEventName = (id) => {
        const ev = events.find(e => e.EventID === id || e._id === id);
        return ev ? ev.EventName : id || "N/A";
    };

    const getUserName = (id) => {
        const user = users.find(u => u.UserID === id || u._id === id);
        return user ? user.UserName : id || "N/A";
    };

    const fetchGroups = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/groups");
            if (res.data.success) setGroups(res.data.data);
        } catch (err) {
            console.error("Error fetching groups:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                IsPaymentDone: formData.IsPaymentDone === "true",
                IsPresent: formData.IsPresent === "true",
                ModifiedAt: new Date()
            };

            if (isEditing) {
                await axios.put(`http://localhost:5000/api/groups/${currentId}`, payload);
            } else {
                payload.CreatedAt = new Date();
                const nextId = groups.length > 0
                    ? Math.max(...groups.map(g => g.GroupID)) + 1
                    : 201;
                await axios.post("http://localhost:5000/api/groups", { ...payload, GroupID: nextId });
            }

            document.getElementById('closeModal').click();
            fetchGroups();
            resetForm();
        } catch (err) {
            alert(err.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this group permanently?")) {
            try {
                await axios.delete(`http://localhost:5000/api/groups/${id}`);
                fetchGroups();
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    const prepareEdit = async (group) => {
        setIsEditing(true);
        setCurrentId(group.GroupID);
        try {
            const res = await axios.get(`http://localhost:5000/api/groups/${group.GroupID}`);
            const fetched = res.data.data;
            setFormData({
                GroupName: fetched.GroupName || "",
                EventID: fetched.EventID?.EventID || fetched.EventID || "",
                IsPaymentDone: String(!!(fetched.IsPaymentDone || fetched.PaymentStatus)),
                IsPresent: String(!!(fetched.IsPresent || fetched.Attendance)),
                CreatedAt: fetched.CreatedAt || "",
                ModifiedAt: fetched.ModifiedAt || "",
                ModifiedBy: fetched.ModifiedBy?.UserID || fetched.ModifiedBy || ""
            });
        } catch (err) {
            console.error("Fetch Edit Error:", err);
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setFormData({
            GroupName: "", EventID: "", IsPaymentDone: "false",
            IsPresent: "false", CreatedAt: "", ModifiedAt: "", ModifiedBy: ""
        });
    };

    const filteredGroups = groups.filter(g =>
        g.GroupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.GroupID.toString().includes(searchTerm)
    );

    return (
        <>
            <header className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                    <button className="btn btn-menu me-3" onClick={toggleSidebar}>
                        <i className="bi bi-list fs-4"></i>
                    </button>
                    <h2 className="fw-bold mb-0">Manage Groups</h2>
                </div>
                <div className="d-flex gap-3">
                    <div className="search-container" style={{ maxWidth: '300px' }}>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-search"></i></span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search groups..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <button className="btn btn-primary rounded-pill px-4" data-bs-toggle="modal" data-bs-target="#groupModal" onClick={resetForm}>
                        <i className="bi bi-plus-lg me-2"></i>Create Group
                    </button>
                </div>
            </header>

            <div className="table-card">
                <div className="table-responsive">
                    <table className="table table-hover align-middle" style={{ minWidth: "1600px" }}>
                        <thead className="table-light">
                            <tr>
                                <th>Group ID</th>
                                <th>Group Name</th>
                                <th>Event</th>
                                <th>Payment</th>
                                <th>Attendance</th>
                                <th>Timeline</th>
                                <th>Modified By</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGroups.map(group => (
                                <tr key={group._id}>
                                    <td>{group.GroupID}</td>
                                    <td className="fw-bold">{group.GroupName}</td>
                                    <td>{getEventName(group.EventID?.EventID || group.EventID)}</td>
                                    <td>
                                        <span className={`badge border badge-status ${group.IsPaymentDone || group.PaymentStatus ? 'bg-success-subtle text-success border-success' : 'bg-danger-subtle text-danger border-danger'}`}>
                                            {group.IsPaymentDone || group.PaymentStatus ? 'Done' : 'Pending'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge border badge-status ${group.IsPresent || group.Attendance ? 'bg-primary-subtle text-primary border-primary' : 'bg-secondary-subtle text-secondary'}`}>
                                            {group.IsPresent || group.Attendance ? 'Present' : 'Absent'}
                                        </span>
                                    </td>
                                    <td>
                                        <small className="d-block">C: {new Date(group.CreatedAt || group.createdAt || Date.now()).toLocaleDateString()}</small>
                                        <small className="text-muted">M: {new Date(group.ModifiedAt || group.updatedAt || Date.now()).toLocaleDateString()}</small>
                                    </td>
                                    <td>{getUserName(group.ModifiedBy?.UserID || group.ModifiedBy)}</td>
                                    <td className="text-center sticky-actions">
                                        <div className="d-flex justify-content-center gap-2">
                                            <button className="btn btn-outline-primary btn-action" data-bs-toggle="modal" data-bs-target="#groupModal" onClick={() => prepareEdit(group)}>
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button className="btn btn-outline-danger btn-action" onClick={() => handleDelete(group.GroupID)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <div className="modal fade" id="groupModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content border-0 shadow">
                        <div className={`modal-header ${isEditing ? 'bg-warning text-dark' : 'bg-primary text-white'}`}>
                            <h5 className="modal-title fw-bold">{isEditing ? "Edit Group Details" : "Create New Group"}</h5>
                            <button type="button" id="closeModal" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body p-4">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Group Name</label>
                                        <input type="text" className="form-control" value={formData.GroupName} onChange={e => setFormData({ ...formData, GroupName: e.target.value })} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Event</label>
                                        <select className="form-select" value={formData.EventID} onChange={e => setFormData({ ...formData, EventID: e.target.value })} required>
                                            <option value="">-- Select Event --</option>
                                            {events.map(ev => <option key={ev.EventID || ev._id} value={ev.EventID || ev._id}>{ev.EventName}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Payment Status</label>
                                        <select className="form-select" value={formData.IsPaymentDone} onChange={e => setFormData({ ...formData, IsPaymentDone: e.target.value })}>
                                            <option value="false">Pending</option>
                                            <option value="true">Done</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Attendance</label>
                                        <select className="form-select" value={formData.IsPresent} onChange={e => setFormData({ ...formData, IsPresent: e.target.value })}>
                                            <option value="false">Absent</option>
                                            <option value="true">Present</option>
                                        </select>
                                    </div>            
                                    </div>
                            </div>
                            <div className="modal-footer border-0">
                                <button type="button" className="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className={`btn rounded-pill px-4 ${isEditing ? 'btn-warning' : 'btn-primary'}`}>
                                    {isEditing ? "Update Changes" : "Save Group"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GroupListPage;