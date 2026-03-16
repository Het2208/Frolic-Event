import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import '../CSS/EventListPage.css';

const EventListpage = () => {
    const { toggleSidebar } = useOutletContext();
    const [events, setEvents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Form State mapped exactly to schema
    const [formData, setFormData] = useState({
        EventName: "", EventTagline: "", EventImage: "", EventDescription: "",
        GroupMinParticipants: 1, GroupMaxParticipants: 1, EventFees: 0,
        EventFirstPrice: "", EventSecondPrice: "", EventThirdPrice: "",
        DepartmentID: "", EventCoOrdinatorID: "",
        EventMainStudentCoOrdinatorName: "", EventMainStudentCoOrdinatorPhone: "",
        EventMainStudentCoOrdinatorEmail: "", EventLocation: "", MaxGroupsAllowed: 50,
        CreatedAt: "", ModifiedAt: "", ModifiedBy: ""
    });

    useEffect(() => {
        fetchEvents();
        fetchDepartments();
        fetchUsers();
    }, []);

    const fetchDepartments = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/departments");
            if (res.data.success) setDepartments(res.data.data);
        } catch (err) { console.error("Error fetching depts", err); }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/users");
            if (res.data.success) setUsers(res.data.data);
        } catch (err) { console.error("Error fetching users", err); }
    };

    const getDepartmentName = (id) => {
        const d = departments.find(x => x.DepartmentID === id || x._id === id);
        return d ? d.DepartmentName : id || "N/A";
    };

    const getUserName = (id) => {
        const u = users.find(x => x.UserID === id || x._id === id);
        return u ? u.UserName : id || "N/A";
    };

    const fetchEvents = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/events");
            if (res.data.success) setEvents(res.data.data);
        } catch (err) { console.error("Fetch error", err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, ModifiedAt: new Date() };
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/events/${currentId}`, payload);
            } else {
                payload.CreatedAt = new Date();
                const nextId = events.length > 0 ? Math.max(...events.map(ev => ev.EventID)) + 1 : 901;
                await axios.post("http://localhost:5000/api/events", { ...payload, EventID: nextId });
            }
            document.getElementById('closeModal').click();
            fetchEvents();
            resetForm();
        } catch (err) { alert(err.response?.data?.message || "Error saving event"); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Permanently delete this event?")) {
            try {
                await axios.delete(`http://localhost:5000/api/events/${id}`);
                fetchEvents();
            } catch (err) { alert("Delete failed"); }
        }
    };

    const prepareEdit = async (ev) => {
        setIsEditing(true);
        setCurrentId(ev.EventID);
        try {
            const res = await axios.get(`http://localhost:5000/api/events/${ev.EventID}`);
            const fetched = res.data.data;
            setFormData({
                EventName: fetched.EventName || "",
                EventTagline: fetched.EventTagline || fetched.Tagline || "",
                EventImage: fetched.EventImage || "",
                EventDescription: fetched.EventDescription || "",
                GroupMinParticipants: fetched.GroupMinParticipants || 1,
                GroupMaxParticipants: fetched.GroupMaxParticipants || 1,
                EventFees: fetched.EventFees || fetched.EntryFees || 0,
                EventFirstPrice: fetched.EventFirstPrice || fetched.FirstPrize || "",
                EventSecondPrice: fetched.EventSecondPrice || fetched.SecondPrize || "",
                EventThirdPrice: fetched.EventThirdPrice || fetched.ThirdPrize || "",
                DepartmentID: fetched.DepartmentID?.DepartmentID || fetched.DepartmentID || "",
                EventCoOrdinatorID: fetched.EventCoOrdinatorID?.UserID || fetched.EventCoOrdinatorID || "",
                EventMainStudentCoOrdinatorName: fetched.EventMainStudentCoOrdinatorName || fetched.StudentCoordinatorName || "",
                EventMainStudentCoOrdinatorPhone: fetched.EventMainStudentCoOrdinatorPhone || fetched.StudentCoordinatorPhone || "",
                EventMainStudentCoOrdinatorEmail: fetched.EventMainStudentCoOrdinatorEmail || fetched.StudentCoordinatorEmail || "",
                EventLocation: fetched.EventLocation || "",
                MaxGroupsAllowed: fetched.MaxGroupsAllowed || 50,
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
            EventName: "", EventTagline: "", EventImage: "", EventDescription: "",
            GroupMinParticipants: 1, GroupMaxParticipants: 1, EventFees: 0,
            EventFirstPrice: "", EventSecondPrice: "", EventThirdPrice: "",
            DepartmentID: "", EventCoOrdinatorID: "",
            EventMainStudentCoOrdinatorName: "", EventMainStudentCoOrdinatorPhone: "",
            EventMainStudentCoOrdinatorEmail: "", EventLocation: "", MaxGroupsAllowed: 50,
            CreatedAt: "", ModifiedAt: "", ModifiedBy: ""
        });
    };

    const filteredEvents = events.filter(ev =>
        ev.EventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.EventID.toString().includes(searchTerm)
    );

    return (
        <>
            <header className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                    <button className="btn btn-menu me-3" onClick={toggleSidebar}>
                        <i className="bi bi-list fs-4"></i>
                    </button>
                    <h2 className="fw-bold mb-0">Manage Events</h2>
                </div>
                <div className="d-flex gap-3">
                    <div className="input-group" style={{ maxWidth: '300px' }}>
                        <span className="input-group-text"><i className="bi bi-search"></i></span>
                        <input type="text" className="form-control" placeholder="Search events..." onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <button className="btn btn-primary rounded-pill px-4" data-bs-toggle="modal" data-bs-target="#eventModal" onClick={resetForm}>
                        <i className="bi bi-plus-lg me-2"></i>Create New Event
                    </button>
                </div>
            </header>

            <div className="table-card">
                <div className="table-responsive">
                    <table className="table table-hover align-middle" style={{ minWidth: "2500px" }}>
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Tagline</th>
                                <th>Description</th>
                                <th>Image</th>
                                <th>Location</th>
                                <th>Part.</th>
                                <th>Fees</th>
                                <th>Max Grps</th>
                                <th>1st Prize</th>
                                <th>2nd Prize</th>
                                <th>3rd Prize</th>
                                <th>Dept</th>
                                <th>Admin Coord</th>
                                <th>Stu. Coord</th>
                                <th>Stu. Phone</th>
                                <th>Stu. Email</th>
                                <th>Timeline</th>
                                <th>Modified By</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.map(ev => (
                                <tr key={ev._id}>
                                    <td>{ev.EventID}</td>
                                    <td className="fw-bold">{ev.EventName}</td>
                                    <td>{ev.EventTagline || ev.Tagline}</td>
                                    <td className="text-truncate" style={{ maxWidth: '150px' }}>{ev.EventDescription}</td>
                                    <td><img src={ev.EventImage || 'https://via.placeholder.com/50'} className="event-img-preview" alt="" /></td>
                                    <td>{ev.EventLocation}</td>
                                    <td>{ev.GroupMinParticipants} - {ev.GroupMaxParticipants}</td>
                                    <td>₹{ev.EventFees || ev.EntryFees}</td>
                                    <td>{ev.MaxGroupsAllowed}</td>
                                    <td className="text-success fw-bold">{ev.EventFirstPrice || ev.FirstPrize}</td>
                                    <td className="text-secondary fw-bold">{ev.EventSecondPrice || ev.SecondPrize}</td>
                                    <td className="text-warning fw-bold">{ev.EventThirdPrice || ev.ThirdPrize}</td>
                                    <td>{getDepartmentName(ev.DepartmentID?.DepartmentID || ev.DepartmentID)}</td>
                                    <td>{getUserName(ev.EventCoOrdinatorID?.UserID || ev.EventCoOrdinatorID)}</td>
                                    <td>{ev.EventMainStudentCoOrdinatorName || ev.StudentCoordinatorName}</td>
                                    <td>{ev.EventMainStudentCoOrdinatorPhone || ev.StudentCoordinatorPhone}</td>
                                    <td>{ev.EventMainStudentCoOrdinatorEmail || ev.StudentCoordinatorEmail}</td>
                                    <td>
                                        <small className="d-block">C: {new Date(ev.CreatedAt || ev.createdAt || Date.now()).toLocaleDateString()}</small>
                                        <small className="text-muted">M: {new Date(ev.ModifiedAt || ev.updatedAt || Date.now()).toLocaleDateString()}</small>
                                    </td>
                                    <td>{getUserName(ev.ModifiedBy?.UserID || ev.ModifiedBy)}</td>
                                    <td className="text-center sticky-actions">
                                        <div className="d-flex justify-content-center gap-2">
                                            <button className="btn btn-outline-primary btn-action" data-bs-toggle="modal" data-bs-target="#eventModal" onClick={() => prepareEdit(ev)}>
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button className="btn btn-outline-danger btn-action" onClick={() => handleDelete(ev.EventID)}>
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

            {/* Large Modal for Event Form */}
            <div className="modal fade" id="eventModal" tabIndex="-1">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content border-0 shadow">
                        <div className={`modal-header ${isEditing ? 'bg-warning text-dark' : 'bg-primary text-white'}`}>
                            <h5 className="modal-title fw-bold">{isEditing ? "Edit Event" : "Add New Event"}</h5>
                            <button type="button" id="closeModal" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body p-4">
                                <div className="row g-3">
                                    <div className="col-md-3">
                                        <label className="form-label fw-bold">Event Name</label>
                                        <input type="text" className="form-control" value={formData.EventName} onChange={e => setFormData({ ...formData, EventName: e.target.value })} required />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label fw-bold">Event Tagline</label>
                                        <input type="text" className="form-control" value={formData.EventTagline} onChange={e => setFormData({ ...formData, EventTagline: e.target.value })} />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label fw-bold">Department</label>
                                        <select className="form-select" value={formData.DepartmentID} onChange={e => setFormData({ ...formData, DepartmentID: e.target.value })} required>
                                            <option value="">-- Select Dept --</option>
                                            {departments.map(d => <option key={d.DepartmentID || d._id} value={d.DepartmentID || d._id}>{d.DepartmentName}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label fw-bold">Location</label>
                                        <input type="text" className="form-control" value={formData.EventLocation} onChange={e => setFormData({ ...formData, EventLocation: e.target.value })} />
                                    </div>

                                    <div className="col-md-3">
                                        <label className="form-label fw-bold">Image URL</label>
                                        <input type="text" className="form-control" value={formData.EventImage} onChange={e => setFormData({ ...formData, EventImage: e.target.value })} />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label fw-bold">Min Part.</label>
                                        <input type="number" className="form-control" value={formData.GroupMinParticipants} onChange={e => setFormData({ ...formData, GroupMinParticipants: e.target.value })} />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label fw-bold">Max Part.</label>
                                        <input type="number" className="form-control" value={formData.GroupMaxParticipants} onChange={e => setFormData({ ...formData, GroupMaxParticipants: e.target.value })} />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label fw-bold">Fees (₹)</label>
                                        <input type="number" className="form-control" value={formData.EventFees} onChange={e => setFormData({ ...formData, EventFees: e.target.value })} />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label fw-bold">Max Groups Let</label>
                                        <input type="number" className="form-control" value={formData.MaxGroupsAllowed} onChange={e => setFormData({ ...formData, MaxGroupsAllowed: e.target.value })} />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label fw-bold text-success">1st Prize</label>
                                        <input type="text" className="form-control" value={formData.EventFirstPrice} onChange={e => setFormData({ ...formData, EventFirstPrice: e.target.value })} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold text-secondary">2nd Prize</label>
                                        <input type="text" className="form-control" value={formData.EventSecondPrice} onChange={e => setFormData({ ...formData, EventSecondPrice: e.target.value })} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold text-warning">3rd Prize</label>
                                        <input type="text" className="form-control" value={formData.EventThirdPrice} onChange={e => setFormData({ ...formData, EventThirdPrice: e.target.value })} />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Admin Coordinator</label>
                                        <select className="form-select" value={formData.EventCoOrdinatorID} onChange={e => setFormData({ ...formData, EventCoOrdinatorID: e.target.value })}>
                                            <option value="">-- Select Event Admin --</option>
                                            {users.map(u => <option key={u.UserID || u._id} value={u.UserID || u._id}>{u.UserName}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Student Main Coord. Name</label>
                                        <input type="text" className="form-control" value={formData.EventMainStudentCoOrdinatorName} onChange={e => setFormData({ ...formData, EventMainStudentCoOrdinatorName: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Student Coord. Phone</label>
                                        <input type="text" className="form-control" value={formData.EventMainStudentCoOrdinatorPhone} onChange={e => setFormData({ ...formData, EventMainStudentCoOrdinatorPhone: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Student Coord. Email</label>
                                        <input type="text" className="form-control" value={formData.EventMainStudentCoOrdinatorEmail} onChange={e => setFormData({ ...formData, EventMainStudentCoOrdinatorEmail: e.target.value })} />
                                    </div>

                                    <div className="col-md-12">
                                        <label className="form-label fw-bold">Description</label>
                                        <textarea className="form-control" rows="2" value={formData.EventDescription} onChange={e => setFormData({ ...formData, EventDescription: e.target.value })}></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-0">
                                <button type="button" className="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className={`btn rounded-pill px-4 ${isEditing ? 'btn-warning' : 'btn-primary'}`}>
                                    {isEditing ? "Update Changes" : "Save Event"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EventListpage;