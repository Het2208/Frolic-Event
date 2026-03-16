import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import '../CSS/DepartmentListPage.css';

const DepartmentListPage = () => {
    const { toggleSidebar } = useOutletContext();
    const [departments, setDepartments] = useState([]);
    const [institutes, setInstitutes] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        DepartmentName: "",
        InstituteID: "",
        DepartmentCoOrdinatorID: "",
        DepartmentImage: "",
        DepartmentDescription: "",
        CreatedAt: "",
        ModifiedAt: "",
        ModifiedBy: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // 1. Fetch data on load
    useEffect(() => {
        fetchDepartments();
        fetchInstitutes();
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/users");
            if (res.data.success) setUsers(res.data.data);
        } catch (err) { console.error("Error fetching users", err); }
    };

    const fetchInstitutes = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/institutes");
            if (res.data.success) setInstitutes(res.data.data);
        } catch (err) { console.error("Error fetching institutes", err); }
    };

    const getUserName = (id) => {
        const user = users.find(u => u.UserID === id || u._id === id);
        return user ? user.UserName : id || "N/A";
    };

    const getInstituteName = (id) => {
        const inst = institutes.find(i => i.InstituteID === id || i._id === id);
        return inst ? inst.InstituteName : id || "N/A";
    };

    const fetchDepartments = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/departments");
            if (res.data.success) setDepartments(res.data.data);
        } catch (err) {
            console.error("Error fetching data", err);
        }
    };

    // 2. Handle Add/Update form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, ModifiedAt: new Date() };
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/departments/${currentId}`, payload);
            } else {
                payload.CreatedAt = new Date();
                const newId = departments.length > 0 ? Math.max(...departments.map(d => d.DepartmentID)) + 1 : 501;
                await axios.post("http://localhost:5000/api/departments", { ...payload, DepartmentID: newId });
            }
            resetForm();
            fetchDepartments();
            document.getElementById('closeModal').click();
        } catch (err) {
            alert("Error saving data: " + err.message);
        }
    };

    // 3. Handle Delete
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this department?")) {
            try {
                await axios.delete(`http://localhost:5000/api/departments/${id}`);
                fetchDepartments();
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    const resetForm = () => {
        setFormData({
            DepartmentName: "", InstituteID: "", DepartmentCoOrdinatorID: "",
            DepartmentImage: "", DepartmentDescription: "", CreatedAt: "", ModifiedAt: "", ModifiedBy: ""
        });
        setIsEditing(false);
    };

    const prepareEdit = async (dept) => {
        setIsEditing(true);
        setCurrentId(dept.DepartmentID);
        try {
            const res = await axios.get(`http://localhost:5000/api/departments/${dept.DepartmentID}`);
            const fetched = res.data.data;
            setFormData({
                DepartmentName: fetched.DepartmentName || "",
                InstituteID: fetched.InstituteID?.InstituteID || fetched.InstituteID || "",
                DepartmentCoOrdinatorID: fetched.DepartmentCoOrdinatorID?.UserID || fetched.DepartmentCoOrdinatorID || "",
                DepartmentImage: fetched.DepartmentImage || fetched.DepartmentImg || "",
                DepartmentDescription: fetched.DepartmentDescription || "",
                CreatedAt: fetched.CreatedAt || "",
                ModifiedAt: fetched.ModifiedAt || "",
                ModifiedBy: fetched.ModifiedBy?.UserID || fetched.ModifiedBy || ""
            });
        } catch (err) {
            console.error("Fetch Edit Error:", err);
        }
    };

    const filteredData = departments.filter(d =>
        d.DepartmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.DepartmentID.toString().includes(searchTerm)
    );

    return (
        <>
            <header className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                    <button className="btn btn-menu me-3" onClick={toggleSidebar}>
                        <i className="bi bi-list fs-4"></i>
                    </button>
                    <h2 className="fw-bold mb-0">Manage Departments</h2>
                </div>
                <div className="d-flex gap-3">
                    <div className="search-container">
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-search"></i></span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search departments..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <button className="btn btn-primary rounded-pill px-4" data-bs-toggle="modal" data-bs-target="#deptModal" onClick={resetForm}>
                        <i className="bi bi-plus-lg me-2"></i>Add New
                    </button>
                </div>
            </header>

            <div className="table-card">
                <div className="table-responsive">
                    <table className="table table-hover align-middle" id="deptTable" style={{ minWidth: "1600px" }}>
                        <thead className="table-light">
                            <tr>
                                <th>Dept ID</th>
                                <th>Image</th>
                                <th>Department Name</th>
                                <th>Institute</th>
                                <th>Coordinator</th>
                                <th>Modified By</th>
                                <th>Timeline</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="tableBody">
                            {filteredData.map((dept) => (
                                <tr key={dept._id}>
                                    <td>{dept.DepartmentID}</td>
                                    <td><img src={dept.DepartmentImage || dept.DepartmentImg || "https://via.placeholder.com/100"} className="dept-img-preview" alt="Dept" /></td>
                                    <td>
                                        <div className="fw-bold">{dept.DepartmentName}</div>
                                        <small className="text-muted d-block text-truncate" style={{ maxWidth: "200px" }}>{dept.DepartmentDescription}</small>
                                    </td>
                                    <td>{getInstituteName(dept.InstituteID?.InstituteID || dept.InstituteID)}</td>
                                    <td>{getUserName(dept.DepartmentCoOrdinatorID?.UserID || dept.DepartmentCoOrdinatorID)}</td>
                                    <td>{getUserName(dept.ModifiedBy?.UserID || dept.ModifiedBy)}</td>
                                    <td>
                                        <small className="d-block">C: {new Date(dept.CreatedAt || dept.createdAt || Date.now()).toLocaleDateString()}</small>
                                        <small className="text-muted">M: {new Date(dept.ModifiedAt || dept.updatedAt || Date.now()).toLocaleDateString()}</small>
                                    </td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center gap-2">
                                            <button className="btn btn-outline-primary btn-action" data-bs-toggle="modal" data-bs-target="#deptModal" onClick={() => prepareEdit(dept)}>
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button className="btn btn-outline-danger btn-action" onClick={() => handleDelete(dept.DepartmentID)}>
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

            {/* Modal for Add/Update */}
            <div className="modal fade" id="deptModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content border-0 shadow">
                        <div className={`modal-header ${isEditing ? 'bg-warning text-dark' : 'bg-primary text-white'}`}>
                            <h5 className="modal-title fw-bold">{isEditing ? "Edit Department" : "Add New Department"}</h5>
                            <button type="button" id="closeModal" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Department Name</label>
                                        <input type="text" className="form-control" value={formData.DepartmentName} onChange={(e) => setFormData({ ...formData, DepartmentName: e.target.value })} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Institute</label>
                                        <select className="form-select" value={formData.InstituteID} onChange={(e) => setFormData({ ...formData, InstituteID: e.target.value })} required>
                                            <option value="">-- Select Institute --</option>
                                            {institutes.map(i => (
                                                <option key={i.InstituteID || i._id} value={i.InstituteID || i._id}>{i.InstituteName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Department Coordinator</label>
                                        <select className="form-select" value={formData.DepartmentCoOrdinatorID} onChange={(e) => setFormData({ ...formData, DepartmentCoOrdinatorID: e.target.value })} required>
                                            <option value="">-- Select Coordinator --</option>
                                            {users.map(u => (
                                                <option key={u.UserID || u._id} value={u.UserID || u._id}>{u.UserName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Image URL</label>
                                        <input type="text" className="form-control" value={formData.DepartmentImage} onChange={(e) => setFormData({ ...formData, DepartmentImage: e.target.value })} />
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label fw-bold">Description</label>
                                        <textarea className="form-control" rows="3" value={formData.DepartmentDescription} onChange={(e) => setFormData({ ...formData, DepartmentDescription: e.target.value })}></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer px-0 pb-0 mt-4 border-0">
                                    <button type="button" className="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                                    <button type="submit" className={`btn rounded-pill px-4 ${isEditing ? 'btn-warning' : 'btn-primary'}`}>
                                        {isEditing ? "Update Changes" : "Save Department"}
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

export default DepartmentListPage;