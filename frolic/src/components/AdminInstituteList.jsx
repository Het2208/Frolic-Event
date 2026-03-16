import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useOutletContext } from 'react-router-dom';
import '../CSS/InstituteListPage.css';

const InstituteListPage = () => {
    const { toggleSidebar } = useOutletContext();
    const [institutes, setInstitutes] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        InstituteName: "",
        InsituteCoOrdinatorID: "",
        InsituteImage: "",
        InsituteDescription: "",
        CreatedAt: "",
        ModifiedAt: "",
        ModifiedBy: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // 1. Fetch All Institutes & Users
    useEffect(() => {
        fetchInstitutes();
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/users");
            if (res.data.success) setUsers(res.data.data);
        } catch (err) { console.error("Error fetching users", err); }
    };

    const getUserName = (id) => {
        // Find by UserID (schema) or _id (MongoDB fallback)
        const user = users.find(u => u.UserID === id || u._id === id);
        return user ? user.UserName : id || "N/A";
    };

    const fetchInstitutes = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/institutes");
            if (res.data.success) setInstitutes(res.data.data);
        } catch (err) {
            console.error("Error fetching data", err);
        }
    };

    // 2. Handle Add/Update Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, ModifiedAt: new Date() };
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/institutes/${currentId}`, payload);
            } else {
                payload.CreatedAt = new Date();
                const nextId = institutes.length > 0 ? Math.max(...institutes.map(i => i.InstituteID)) + 1 : 101;
                await axios.post("http://localhost:5000/api/institutes", { ...payload, InstituteID: nextId });
            }
            resetForm();
            fetchInstitutes();
            document.getElementById('closeModal').click(); // Bootstrap manual close
        } catch (err) {
            alert(err.response?.data?.message || "Error saving institute");
        }
    };

    // 3. Handle Delete
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure? This will permanently delete the institute.")) {
            try {
                await axios.delete(`http://localhost:5000/api/institutes/${id}`);
                fetchInstitutes();
            } catch (err) {
                alert("Delete operation failed.");
            }
        }
    };

    const resetForm = () => {
        setFormData({ InstituteName: "", InsituteCoOrdinatorID: "", InsituteImage: "", InsituteDescription: "", CreatedAt: "", ModifiedAt: "", ModifiedBy: "" });
        setIsEditing(false);
    };

    const prepareEdit = async (inst) => {
        setIsEditing(true);
        setCurrentId(inst.InstituteID);
        try {
            const res = await axios.get(`http://localhost:5000/api/institutes/${inst.InstituteID}`);
            const fetched = res.data.data;
            setFormData({
                InstituteName: fetched.InstituteName || "",
                InsituteCoOrdinatorID: fetched.InsituteCoOrdinatorID?.UserID || fetched.InsituteCoOrdinatorID || "",
                InsituteImage: fetched.InsituteImage || "",
                InsituteDescription: fetched.InsituteDescription || "",
                CreatedAt: fetched.CreatedAt || "",
                ModifiedAt: fetched.ModifiedAt || "",
                ModifiedBy: fetched.ModifiedBy?.UserID || fetched.ModifiedBy || ""
            });
        } catch (err) {
            console.error("Fetch Edit Error:", err);
        }
    };

    const filteredData = institutes.filter(inst =>
        inst.InstituteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.InstituteID.toString().includes(searchTerm)
    );

    return (
        <>
            <header className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                    <button className="btn btn-menu me-3" onClick={toggleSidebar}>
                        <i className="bi bi-list fs-4"></i>
                    </button>
                    <h2 className="fw-bold mb-0">Manage Institutes</h2>
                    <span className="badge bg-primary ms-3 rounded-pill">Total: {institutes.length}</span>
                </div>
                <div className="d-flex gap-3">
                    <div className="search-container">
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-search"></i></span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search data..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <button className="btn btn-primary rounded-pill px-4" data-bs-toggle="modal" data-bs-target="#instModal" onClick={resetForm}>
                        <i className="bi bi-plus-lg me-2"></i>Add New
                    </button>
                </div>
            </header>

            <div className="table-card">
                <div className="table-responsive">
                    <table className="table table-hover align-middle" id="instTable" style={{ minWidth: "1600px" }}>
                        <thead className="table-light">
                            <tr>
                                <th>ID #</th>
                                <th>Image</th>
                                <th>Institute Name</th>
                                <th>Description</th>
                                <th>Coordinator</th>
                                <th>Modified By</th>
                                <th>Timeline</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((inst) => (
                                <tr key={inst._id}>
                                    <td>{inst.InstituteID}</td>
                                    <td>
                                        <img src={inst.InsituteImage || "https://via.placeholder.com/60"} className="dept-img-preview" alt="Institute" />
                                    </td>
                                    <td className="fw-bold">{inst.InstituteName}</td>
                                    <td className="text-truncate" style={{ maxWidth: '150px' }}>{inst.InsituteDescription || 'N/A'}</td>
                                    <td>{getUserName(inst.InsituteCoOrdinatorID?.UserID || inst.InsituteCoOrdinatorID)}</td>
                                    <td>{getUserName(inst.ModifiedBy?.UserID || inst.ModifiedBy)}</td>
                                    <td>
                                        <small className="d-block">C: {new Date(inst.CreatedAt || inst.createdAt || Date.now()).toLocaleDateString()}</small>
                                        <small className="text-muted">M: {new Date(inst.ModifiedAt || inst.updatedAt || Date.now()).toLocaleDateString()}</small>
                                    </td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center gap-2">
                                            <button className="btn btn-outline-primary btn-action" data-bs-toggle="modal" data-bs-target="#instModal" onClick={() => prepareEdit(inst)}>
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button className="btn btn-outline-danger btn-action" onClick={() => handleDelete(inst.InstituteID)}>
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

            {/* Form Modal */}
            <div className="modal fade" id="instModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content border-0 shadow">
                        <div className={`modal-header ${isEditing ? 'bg-warning text-dark' : 'bg-primary text-white'}`}>
                            <h5 className="modal-title fw-bold">{isEditing ? "Edit Institute" : "Add New Institute"}</h5>
                            <button type="button" id="closeModal" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Institute Name</label>
                                        <input type="text" className="form-control" value={formData.InstituteName} onChange={(e) => setFormData({ ...formData, InstituteName: e.target.value })} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Institute Coordinator</label>
                                        <select className="form-select" value={formData.InsituteCoOrdinatorID} onChange={(e) => setFormData({ ...formData, InsituteCoOrdinatorID: e.target.value })} required>
                                            <option value="">-- Select Coordinator --</option>
                                            {users.map(u => (
                                                <option key={u.UserID || u._id} value={u.UserID || u._id}>{u.UserName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label fw-bold">Institute Image URL</label>
                                        <input type="text" className="form-control" value={formData.InsituteImage} onChange={(e) => setFormData({ ...formData, InsituteImage: e.target.value })} />
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label fw-bold">Institute Description</label>
                                        <textarea className="form-control" rows="3" value={formData.InsituteDescription} onChange={(e) => setFormData({ ...formData, InsituteDescription: e.target.value })}></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer px-0 pb-0 mt-4 border-0">
                                    <button type="button" className="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                                    <button type="submit" className={`btn rounded-pill px-4 ${isEditing ? 'btn-warning' : 'btn-primary'}`}>
                                        {isEditing ? "Update Changes" : "Save Institute"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InstituteListPage;