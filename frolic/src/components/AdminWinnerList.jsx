import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import '../CSS/WinnerDisplaypage.css';

const WinnerDisplayPage = () => {
    const { toggleSidebar } = useOutletContext();
    const [winners, setWinners] = useState([]);
    const [events, setEvents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        EventID: "",
        FirstWinnerGroupID: "",
        SecondWinnerGroupID: "",
        ThirdWinnerGroupID: "",
        CreatedAt: "",
        ModifiedAt: "",
        ModifiedBy: ""
    });

    useEffect(() => {
        fetchWinners();
        fetchEvents();
        fetchGroups();
        fetchUsers();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/events");
            if (res.data.success) setEvents(res.data.data);
        } catch (err) { console.error("Error fetching events:", err); }
    };

    const fetchGroups = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/groups");
            if (res.data.success) setGroups(res.data.data);
        } catch (err) { console.error("Error fetching groups:", err); }
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

    const getGroupName = (id) => {
        if (!id) return "N/A";
        const group = groups.find(g => g.GroupID === id || g._id === id);
        return group ? group.GroupName : id;
    };

    const getUserName = (id) => {
        const user = users.find(u => u.UserID === id || u._id === id);
        return user ? user.UserName : id || "N/A";
    };

    const fetchWinners = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/winners");
            if (res.data.success) setWinners(res.data.data);
        } catch (err) {
            console.error("Error fetching winners:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, ModifiedAt: new Date() };
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/winners/${currentId}`, payload);
            } else {
                payload.CreatedAt = new Date();
                const nextId = winners.length > 0
                    ? Math.max(...winners.map(w => w.WinnerID || w.EventWiseWinnerID || 0)) + 1
                    : 7001;
                await axios.post("http://localhost:5000/api/winners", { ...payload, WinnerID: nextId });
            }

            document.getElementById('closeModal').click();
            fetchWinners();
            resetForm();
        } catch (err) {
            alert(err.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Remove this winner record permanently?")) {
            try {
                await axios.delete(`http://localhost:5000/api/winners/${id}`);
                fetchWinners();
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    const prepareEdit = async (winner) => {
        setIsEditing(true);
        setCurrentId(winner.WinnerID || winner.EventWiseWinnerID);
        try {
            const res = await axios.get(`http://localhost:5000/api/winners/${winner.WinnerID || winner.EventWiseWinnerID}`);
            const fetched = res.data.data;
            setFormData({
                EventID: fetched.EventID?.EventID || fetched.EventID || "",
                FirstWinnerGroupID: fetched.FirstWinnerGroupID?.GroupID || fetched.FirstWinnerGroupID || "",
                SecondWinnerGroupID: fetched.SecondWinnerGroupID?.GroupID || fetched.SecondWinnerGroupID || "",
                ThirdWinnerGroupID: fetched.ThirdWinnerGroupID?.GroupID || fetched.ThirdWinnerGroupID || "",
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
            EventID: "", FirstWinnerGroupID: "", SecondWinnerGroupID: "",
            ThirdWinnerGroupID: "", CreatedAt: "", ModifiedAt: "", ModifiedBy: ""
        });
    };

    const filteredWinners = winners.filter(w =>
        (w.EventID?.EventID || "").toString().includes(searchTerm) ||
        (getEventName(w.EventID?.EventID || w.EventID)).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <header className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                    <button className="btn btn-menu me-3" onClick={toggleSidebar}>
                        <i className="bi bi-list fs-4"></i>
                    </button>
                    <h2 className="fw-bold mb-0">Manage Winners</h2>
                </div>
                <div className="d-flex gap-3">
                    <div className="search-container" style={{ maxWidth: '300px' }}>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-search"></i></span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by Event/Group ID..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <button className="btn btn-primary rounded-pill px-4" data-bs-toggle="modal" data-bs-target="#winnerModal" onClick={resetForm}>
                        <i className="bi bi-plus-lg me-2"></i>Declare Winner
                    </button>
                </div>
            </header>

            <div className="table-card">
                <div className="table-responsive">
                    <table className="table table-hover align-middle" style={{ minWidth: "1400px" }}>
                        <thead className="table-light">
                            <tr>
                                <th>Winner ID</th>
                                <th>Event</th>
                                <th>1st Place</th>
                                <th>2nd Place</th>
                                <th>3rd Place</th>
                                <th>Timeline</th>
                                <th>Modified By</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWinners.map(w => {
                                return (
                                    <tr key={w._id}>
                                        <td>{w.WinnerID || w.EventWiseWinnerID}</td>
                                        <td>{getEventName(w.EventID?.EventID || w.EventID)}</td>
                                        <td>{getGroupName(w.FirstWinnerGroupID?.GroupID || w.FirstWinnerGroupID)}</td>
                                        <td>{getGroupName(w.SecondWinnerGroupID?.GroupID || w.SecondWinnerGroupID)}</td>
                                        <td>{getGroupName(w.ThirdWinnerGroupID?.GroupID || w.ThirdWinnerGroupID)}</td>
                                        <td>
                                            <small className="d-block">C: {new Date(w.CreatedAt || w.createdAt || Date.now()).toLocaleDateString()}</small>
                                            <small className="text-muted">M: {new Date(w.ModifiedAt || w.updatedAt || Date.now()).toLocaleDateString()}</small>
                                        </td>
                                        <td>{getUserName(w.ModifiedBy?.UserID || w.ModifiedBy)}</td>
                                        <td className="text-center sticky-actions">
                                            <div className="d-flex justify-content-center gap-2">
                                                <button className="btn btn-outline-primary btn-action" data-bs-toggle="modal" data-bs-target="#winnerModal" onClick={() => prepareEdit(w)}>
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                                <button className="btn btn-outline-danger btn-action" onClick={() => handleDelete(w.WinnerID || w.EventWiseWinnerID)}>
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <div className="modal fade" id="winnerModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content border-0 shadow">
                        <div className={`modal-header ${isEditing ? 'bg-warning text-dark' : 'bg-primary text-white'}`}>
                            <h5 className="modal-title fw-bold">{isEditing ? "Edit Winner Record" : "Declare New Winner"}</h5>
                            <button type="button" id="closeModal" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body p-4">
                                <div className="row g-3">
                                    <div className="col-md-12">
                                        <label className="form-label fw-bold">Event</label>
                                        <select className="form-select" value={formData.EventID} onChange={e => setFormData({ ...formData, EventID: e.target.value })} required>
                                            <option value="">-- Select Event --</option>
                                            {events.map(ev => <option key={ev.EventID || ev._id} value={ev.EventID || ev._id}>{ev.EventName}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold text-warning">1st Place Group</label>
                                        <select className="form-select" value={formData.FirstWinnerGroupID} onChange={e => setFormData({ ...formData, FirstWinnerGroupID: e.target.value })}>
                                            <option value="">-- Select Group --</option>
                                            {groups.map(g => <option key={g.GroupID || g._id} value={g.GroupID || g._id}>{g.GroupName} (ID: {g.GroupID})</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold text-secondary">2nd Place Group</label>
                                        <select className="form-select" value={formData.SecondWinnerGroupID} onChange={e => setFormData({ ...formData, SecondWinnerGroupID: e.target.value })}>
                                            <option value="">-- Select Group --</option>
                                            {groups.map(g => <option key={g.GroupID || g._id} value={g.GroupID || g._id}>{g.GroupName} (ID: {g.GroupID})</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold text-danger">3rd Place Group</label>
                                        <select className="form-select" value={formData.ThirdWinnerGroupID} onChange={e => setFormData({ ...formData, ThirdWinnerGroupID: e.target.value })}>
                                            <option value="">-- Select Group --</option>
                                            {groups.map(g => <option key={g.GroupID || g._id} value={g.GroupID || g._id}>{g.GroupName} (ID: {g.GroupID})</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-0">
                                <button type="button" className="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className={`btn rounded-pill px-4 ${isEditing ? 'btn-warning' : 'btn-primary'}`}>
                                    {isEditing ? "Update Record" : "Save Winner"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WinnerDisplayPage;