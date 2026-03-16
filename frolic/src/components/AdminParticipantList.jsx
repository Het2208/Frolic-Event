import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import '../CSS/ParticipantListPage.css';

const ParticipantListPage = () => {
    const { toggleSidebar } = useOutletContext();
    const [participants, setParticipants] = useState([]);
    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Form State mapped to exact schema
    const [formData, setFormData] = useState({
        ParticipantName: "",
        ParticipantEnrollmentNumber: "",
        ParticipantInsituteName: "",
        ParticipantCity: "",
        ParticipantMobile: "",
        ParticipantEmail: "",
        IsGroupLeader: "false",
        GroupID: "",
        CreatedAt: "",
        ModifiedAt: "",
        ModifiedBy: ""
    });

    useEffect(() => {
        fetchParticipants();
        fetchGroups();
        fetchUsers();
    }, []);

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

    const getGroupName = (id) => {
        const group = groups.find(g => g.GroupID === id || g._id === id);
        return group ? group.GroupName : id || "N/A";
    };

    const getUserName = (id) => {
        const user = users.find(u => u.UserID === id || u._id === id);
        return user ? user.UserName : id || "N/A";
    };

    const fetchParticipants = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/participants");
            if (res.data.success) setParticipants(res.data.data);
        } catch (err) {
            console.error("Error fetching participants:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                IsGroupLeader: formData.IsGroupLeader === "true",
                ModifiedAt: new Date()
            };

            if (isEditing) {
                await axios.put(`http://localhost:5000/api/participants/${currentId}`, payload);
            } else {
                payload.CreatedAt = new Date();
                const nextId = participants.length > 0
                    ? Math.max(...participants.map(p => p.ParticipantID)) + 1
                    : 1001;
                await axios.post("http://localhost:5000/api/participants", { ...payload, ParticipantID: nextId });
            }

            document.getElementById('closeModal').click();
            fetchParticipants();
            resetForm();
        } catch (err) {
            alert(err.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to remove this participant?")) {
            try {
                await axios.delete(`http://localhost:5000/api/participants/${id}`);
                fetchParticipants();
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    const prepareEdit = async (p) => {
        setIsEditing(true);
        setCurrentId(p.ParticipantID);
        try {
            const res = await axios.get(`http://localhost:5000/api/participants/${p.ParticipantID}`);
            const fetched = res.data.data;
            setFormData({
                ParticipantName: fetched.ParticipantName || fetched.ParticipantFullName || "",
                ParticipantEnrollmentNumber: fetched.ParticipantEnrollmentNumber || fetched.EnrollmentNumber || "",
                ParticipantInsituteName: fetched.ParticipantInsituteName || fetched.InstituteName || "",
                ParticipantCity: fetched.ParticipantCity || fetched.City || "",
                ParticipantMobile: fetched.ParticipantMobile || fetched.MobileNumber || "",
                ParticipantEmail: fetched.ParticipantEmail || fetched.EmailAddress || "",
                IsGroupLeader: String(!!fetched.IsGroupLeader),
                GroupID: fetched.GroupID?.GroupID || fetched.GroupID || "",
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
            ParticipantName: "", ParticipantEnrollmentNumber: "", ParticipantInsituteName: "",
            ParticipantCity: "", ParticipantMobile: "", ParticipantEmail: "",
            IsGroupLeader: "false", GroupID: "", CreatedAt: "", ModifiedAt: "", ModifiedBy: ""
        });
    };

    const filteredParticipants = participants.filter(p =>
        (p.ParticipantName || p.ParticipantFullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.ParticipantEnrollmentNumber || p.EnrollmentNumber || "").includes(searchTerm)
    );

    return (
        <>
            <header className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                    <button className="btn btn-menu me-3" onClick={toggleSidebar}>
                        <i className="bi bi-list fs-4"></i>
                    </button>
                    <h2 className="fw-bold mb-0">Manage Participants</h2>
                </div>
                <div className="d-flex gap-3">
                    <div className="input-group" style={{ maxWidth: '300px' }}>
                        <span className="input-group-text"><i className="bi bi-search"></i></span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search participants..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary rounded-pill px-4" data-bs-toggle="modal" data-bs-target="#participantModal" onClick={resetForm}>
                        <i className="bi bi-plus-lg me-2"></i>Add Participant
                    </button>
                </div>
            </header>

            <div className="table-card">
                <div className="table-responsive">
                    <table className="table table-hover align-middle" style={{ minWidth: "1600px" }}>
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Full Name</th>
                                <th>Enrollment No.</th>
                                <th>Institute</th>
                                <th>City</th>
                                <th>Mobile</th>
                                <th>Email</th>
                                <th>Leader?</th>
                                <th>Group ID</th>
                                <th>Timeline</th>
                                <th>Modified By</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredParticipants.map(p => (
                                <tr key={p._id}>
                                    <td>{p.ParticipantID}</td>
                                    <td className="fw-bold">{p.ParticipantName || p.ParticipantFullName}</td>
                                    <td>{p.ParticipantEnrollmentNumber || p.EnrollmentNumber}</td>
                                    <td>{p.ParticipantInsituteName || p.InstituteName}</td>
                                    <td>{p.ParticipantCity || p.City}</td>
                                    <td>{p.ParticipantMobile || p.MobileNumber}</td>
                                    <td>{p.ParticipantEmail || p.EmailAddress}</td>
                                    <td>
                                        {p.IsGroupLeader ?
                                            <span className="badge bg-success-subtle text-success border border-success">Yes</span> :
                                            <span className="badge bg-secondary-subtle text-secondary border">No</span>
                                        }
                                    </td>
                                    <td>{getGroupName(p.GroupID?.GroupID || p.GroupID)}</td>
                                    <td>
                                        <small className="d-block">C: {new Date(p.CreatedAt || p.createdAt || Date.now()).toLocaleDateString()}</small>
                                        <small className="text-muted">M: {new Date(p.ModifiedAt || p.updatedAt || Date.now()).toLocaleDateString()}</small>
                                    </td>
                                    <td>{getUserName(p.ModifiedBy?.UserID || p.ModifiedBy)}</td>
                                    <td className="text-center sticky-actions">
                                        <div className="d-flex justify-content-center gap-2">
                                            <button className="btn btn-outline-primary btn-action" data-bs-toggle="modal" data-bs-target="#participantModal" onClick={() => prepareEdit(p)}>
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button className="btn btn-outline-danger btn-action" onClick={() => handleDelete(p.ParticipantID)}>
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
            <div className="modal fade" id="participantModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content border-0 shadow">
                        <div className={`modal-header ${isEditing ? 'bg-warning text-dark' : 'bg-primary text-white'}`}>
                            <h5 className="modal-title fw-bold">{isEditing ? "Edit Participant" : "Add Participant"}</h5>
                            <button type="button" id="closeModal" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body p-4">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Full Name</label>
                                        <input type="text" className="form-control" value={formData.ParticipantName} onChange={e => setFormData({ ...formData, ParticipantName: e.target.value })} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Enrollment No.</label>
                                        <input type="text" className="form-control" value={formData.ParticipantEnrollmentNumber} onChange={e => setFormData({ ...formData, ParticipantEnrollmentNumber: e.target.value })} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Institute Name</label>
                                        <input type="text" className="form-control" value={formData.ParticipantInsituteName} onChange={e => setFormData({ ...formData, ParticipantInsituteName: e.target.value })} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">City</label>
                                        <input type="text" className="form-control" value={formData.ParticipantCity} onChange={e => setFormData({ ...formData, ParticipantCity: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Mobile</label>
                                        <input type="text" className="form-control" value={formData.ParticipantMobile} onChange={e => setFormData({ ...formData, ParticipantMobile: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Email</label>
                                        <input type="email" className="form-control" value={formData.ParticipantEmail} onChange={e => setFormData({ ...formData, ParticipantEmail: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Is Group Leader?</label>
                                        <select className="form-select" value={formData.IsGroupLeader} onChange={e => setFormData({ ...formData, IsGroupLeader: e.target.value })}>
                                            <option value="false">No</option>
                                            <option value="true">Yes</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Group ID</label>
                                        <select className="form-select" value={formData.GroupID} onChange={e => setFormData({ ...formData, GroupID: e.target.value })}>
                                            <option value="">-- No Group --</option>
                                            {groups.map(g => <option key={g.GroupID || g._id} value={g.GroupID || g._id}>{g.GroupName}</option>)}
                                        </select>
                                    </div>                                </div>
                            </div>
                            <div className="modal-footer border-0">
                                <button type="button" className="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className={`btn rounded-pill px-4 ${isEditing ? 'btn-warning' : 'btn-primary'}`}>
                                    {isEditing ? "Update Changes" : "Save Participant"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ParticipantListPage;