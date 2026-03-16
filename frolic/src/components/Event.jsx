// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import '../CSS/index.css';
// import Navbar from './Navbar';

// import axios from 'axios';

// export default function Event() {
//     const [eventsData, setEventsData] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [showRegistrationForm, setShowRegistrationForm] = useState(false);
//     const [participationType, setParticipationType] = useState('Individual');
//     const [eventGroups, setEventGroups] = useState([]);
//     const [selectedGroupId, setSelectedGroupId] = useState('');
//     const [registrationSuccessMsg, setRegistrationSuccessMsg] = useState('');
//     const [registrationErrorMsg, setRegistrationErrorMsg] = useState('');

//     useEffect(() => {
//         axios.get("http://localhost:5000/api/events")
//             .then((res) => {
//                 if (res.data.success) {
//                     setEventsData(res.data.data);
//                 } else {
//                     setError("Failed to fetch events");
//                 }
//                 setLoading(false);
//             })
//             .catch((err) => {
//                 console.error("Error fetching events:", err);
//                 setError("Unable to connect to the server.");
//                 setLoading(false);
//             });
//     }, []);

//     // Fetch related groups when an event is selected and "Group" is toggled
//     useEffect(() => {
//         if (selectedEvent && participationType === 'Group') {
//             const eventIdToQuery = selectedEvent.EventID || selectedEvent._id;
//             axios.get(`http://localhost:5000/api/groups/event/${eventIdToQuery}`)
//                 .then(res => {
//                     if (res.data.success) setEventGroups(res.data.data);
//                 })
//                 .catch(err => console.error("Error fetching event groups", err));
//         }
//     }, [participationType, selectedEvent]);

//     const handleRegisterClick = () => {
//         setRegistrationSuccessMsg('');
//         setRegistrationErrorMsg('');
//         setShowRegistrationForm(true);
//     };

//     const submitRegistration = async () => {
//         setRegistrationSuccessMsg('');
//         setRegistrationErrorMsg('');

//         // Mocked or dynamically fetched ParticipantID as per the instruction
//         // In a real application, this would come from Auth Context
//         const activeUserId = 1001;

//         try {
//             const payload = {
//                 eventID: selectedEvent.EventID || selectedEvent._id,
//                 participantID: activeUserId
//             };

//             if (participationType === 'Group') {
//                 if (!selectedGroupId) {
//                     setRegistrationErrorMsg("Please select a group first.");
//                     return;
//                 }
//                 payload.groupID = selectedGroupId;
//             }

//             const res = await axios.post("http://localhost:5000/api/event-registration", payload);
//             if (res.data.success) {
//                 setRegistrationSuccessMsg("✅ You have successfully registered for this event.");
//                 // auto-hide form after success
//                 setTimeout(() => {
//                     setShowRegistrationForm(false);
//                     setRegistrationSuccessMsg('');
//                 }, 3000);
//             }
//         } catch (err) {
//             setRegistrationErrorMsg(err.response?.data?.message || "Failed to register. Please try again.");
//         }
//     };

//     const filteredEvents = eventsData.filter(ev =>
//         (ev.EventName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (ev.EventTagline || ev.Tagline || "").toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <>
//             <Navbar />

//             <div className="container py-5">
//                 <div className="text-center mb-5">
//                     <h2 className="fw-bold display-5" style={{ color: 'var(--floric-blue)' }}>FROLIC 2026 Events</h2>
//                     <p className="opacity-75 fs-5">Browse technical competitions and view full event details</p>
//                 </div>

//                 <div className="user-search-wrapper mb-5">
//                     <div className="input-group search-glass shadow-sm">
//                         <span className="input-group-text border-0 bg-transparent"><i className="bi bi-search"></i></span>
//                         <input
//                             type="text"
//                             className="form-control"
//                             placeholder="Search by event name or tagline..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                     </div>
//                 </div>

//                 <div className="row g-4">
//                     {loading ? (
//                         <div className="col-12 text-center py-5">
//                             <div className="spinner-border text-primary" role="status">
//                                 <span className="visually-hidden">Loading...</span>
//                             </div>
//                             <p className="mt-2 text-muted">Loading amazing events...</p>
//                         </div>
//                     ) : error ? (
//                         <div className="col-12 text-center py-5 text-danger">
//                             <i className="bi bi-exclamation-triangle-fill fs-1"></i>
//                             <p className="mt-2">{error}</p>
//                         </div>
//                     ) : filteredEvents.length === 0 ? (
//                         <div className="col-12 text-center py-5">
//                             <p className="text-muted">No events found matching your search.</p>
//                         </div>
//                     ) : (
//                         filteredEvents.map((ev) => (
//                             <div key={ev.EventID || ev._id} className="col-md-6 col-lg-4">
//                                 <div className="event-card">
//                                     <div className="fee-badge">₹{ev.EventFees || ev.EntryFees || "N/A"}</div>
//                                     <img src={ev.EventImage || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500"} className="event-img" alt={ev.EventName} />
//                                     <div className="p-4 text-center">
//                                         <h4 className="fw-bold mb-1">{ev.EventName}</h4>
//                                         <p className="text-primary small mb-3"><i>"{ev.EventTagline || ev.Tagline || ""}"</i></p>
//                                         <button
//                                             className="btn btn-outline-primary rounded-pill px-4 btn-sm w-100 fw-bold"
//                                             data-bs-toggle="modal"
//                                             data-bs-target="#eventDetailModal"
//                                             onClick={() => {
//                                                 setSelectedEvent(ev);
//                                                 setShowRegistrationForm(false);
//                                                 setParticipationType('Individual');
//                                                 setRegistrationSuccessMsg('');
//                                                 setRegistrationErrorMsg('');
//                                             }}
//                                         >
//                                             View Details
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>
//             </div>

//             {/* Modal */}
//             <div className="modal fade" id="eventDetailModal" tabIndex="-1" aria-hidden="true">
//                 <div className="modal-dialog modal-lg modal-dialog-centered">
//                     <div className="modal-content shadow-lg">
//                         <div className="modal-header border-0 pb-0">
//                             <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                         </div>
//                         <div className="modal-body p-4 pt-0">
//                             {selectedEvent && (
//                                 <div className="row">
//                                     <div className="col-md-5">
//                                         <img src={selectedEvent.EventImage || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500"} className="img-fluid rounded-4 mb-3 shadow-sm" alt={selectedEvent.EventName} />
//                                         <div className="prize-box mb-3">
//                                             <div className="detail-label">🏆 1st Prize</div>
//                                             <div className="fw-bold fs-5 text-success">{selectedEvent.EventFirstPrice || selectedEvent.FirstPrize || "N/A"}</div>
//                                             <div className="detail-label mt-2">🥈 2nd Prize</div>
//                                             <div className="fw-bold">{selectedEvent.EventSecondPrice || selectedEvent.SecondPrize || "N/A"}</div>
//                                             <div className="detail-label mt-2">🥉 3rd Prize</div>
//                                             <div className="fw-bold">{selectedEvent.EventThirdPrice || selectedEvent.ThirdPrize || "N/A"}</div>
//                                         </div>
//                                     </div>
//                                     <div className="col-md-7">
//                                         <h2 className="fw-bold mb-1" style={{ color: 'var(--floric-blue)' }}>{selectedEvent.EventName}</h2>
//                                         <p className="text-primary fw-bold mb-3">"{selectedEvent.EventTagline || selectedEvent.Tagline || ""}"</p>
//                                         <hr className="opacity-10" />
//                                         <div className="row">
//                                             <div className="col-6">
//                                                 <div className="detail-label">💰 Entry Fees</div>
//                                                 <div className="detail-value fs-5">₹{selectedEvent.EventFees || selectedEvent.EntryFees || 0}</div>
//                                             </div>
//                                             <div className="col-6">
//                                                 <div className="detail-label">📍 Location</div>
//                                                 <div className="detail-value">{selectedEvent.EventLocation || "Campus"}</div>
//                                             </div>
//                                             <div className="col-6">
//                                                 <div className="detail-label">👥 Group Size</div>
//                                                 <div className="detail-value">{selectedEvent.GroupMinParticipants} to {selectedEvent.GroupMaxParticipants} Members</div>
//                                             </div>
//                                             <div className="col-6">
//                                                 <div className="detail-label">🏢 Dept ID</div>
//                                                 <div className="detail-value">{selectedEvent.DepartmentID?.DepartmentName || selectedEvent.DepartmentID || "N/A"}</div>
//                                             </div>
//                                         </div>
//                                         <div className="detail-label">📝 Description</div>
//                                         <p className="small opacity-75">{selectedEvent.EventDescription}</p>
//                                         <div className="mt-3 p-3 bg-light rounded-4 text-dark shadow-sm">
//                                             <div className="detail-label text-dark opacity-50">Student Coordinator</div>
//                                             <div className="fw-bold">{selectedEvent.EventMainStudentCoOrdinatorName || selectedEvent.StudentCoordinatorName || "N/A"}</div>
//                                             <div className="small"><i className="bi bi-telephone"></i> {selectedEvent.EventMainStudentCoOrdinatorPhone || selectedEvent.StudentCoordinatorPhone || "N/A"}</div>
//                                             <div className="small"><i className="bi bi-envelope"></i> {selectedEvent.EventMainStudentCoOrdinatorEmail || selectedEvent.StudentCoordinatorEmail || "N/A"}</div>
//                                         </div>
//                                     </div>

//                                     {/* Registration Section */}
//                                     <div className="mt-4 pt-4 border-top">
//                                         {registrationSuccessMsg && (
//                                             <div className="alert alert-success fw-bold p-3 shadow-sm rounded-3">
//                                                 {registrationSuccessMsg}
//                                             </div>
//                                         )}
//                                         {registrationErrorMsg && (
//                                             <div className="alert alert-danger fw-bold p-3 rounded-3">
//                                                 {registrationErrorMsg}
//                                             </div>
//                                         )}

//                                         {!showRegistrationForm && !registrationSuccessMsg && (
//                                             <button onClick={handleRegisterClick} className="btn btn-primary rounded-pill px-5 py-2 fw-bold w-100 w-md-auto">
//                                                 Register in Event
//                                             </button>
//                                         )}

//                                         {showRegistrationForm && !registrationSuccessMsg && (
//                                             <div className="registration-panel bg-light p-4 rounded-4 shadow-sm border mt-3">
//                                                 <h5 className="fw-bold mb-3 text-primary">Select Participation Type</h5>

//                                                 <div className="d-flex gap-4 mb-3">
//                                                     <div className="form-check">
//                                                         <input className="form-check-input" type="radio" name="participationType" id="individualRadio" value="Individual"
//                                                             checked={participationType === 'Individual'}
//                                                             onChange={() => setParticipationType('Individual')} />
//                                                         <label className="form-check-label fw-bold" htmlFor="individualRadio">Individual</label>
//                                                     </div>
//                                                     <div className="form-check">
//                                                         <input className="form-check-input" type="radio" name="participationType" id="groupRadio" value="Group"
//                                                             checked={participationType === 'Group'}
//                                                             onChange={() => setParticipationType('Group')} />
//                                                         <label className="form-check-label fw-bold" htmlFor="groupRadio">Group</label>
//                                                     </div>
//                                                 </div>

//                                                 {participationType === 'Group' && (
//                                                     <div className="mb-4">
//                                                         <label className="form-label fw-bold text-secondary">Select Your Group</label>
//                                                         <select className="form-select form-select-lg rounded-3 shadow-sm" value={selectedGroupId} onChange={(e) => setSelectedGroupId(e.target.value)}>
//                                                             <option value="">-- Choose a Group --</option>
//                                                             {eventGroups.map(grp => (
//                                                                 <option key={grp._id || grp.GroupID} value={grp.GroupID || grp._id}>{grp.GroupName}</option>
//                                                             ))}
//                                                         </select>
//                                                         {eventGroups.length === 0 && <small className="text-danger d-block mt-2">No groups available for this event yet.</small>}
//                                                     </div>
//                                                 )}

//                                                 <div className="d-flex gap-3 justify-content-end">
//                                                     <button onClick={() => setShowRegistrationForm(false)} className="btn btn-outline-secondary rounded-pill px-4 fw-bold">Cancel</button>
//                                                     <button onClick={submitRegistration} className="btn btn-success rounded-pill px-5 fw-bold shadow-sm" disabled={participationType === 'Group' && !selectedGroupId}>
//                                                         Submit Registration
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                         <div className="modal-footer border-0">
//                             <button type="button" className="btn btn-secondary rounded-pill px-4 fw-bold" data-bs-dismiss="modal">Close Window</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <footer className="text-center mt-5">
//                 <div className="container py-4 border-top border-secondary opacity-25">
//                     <p className="mb-1 fw-bold" style={{ color: 'var(--floric-blue)' }}>FROLIC 2026</p>
//                     <p className="small mb-0">&copy; 2026 Frolic Event</p>
//                 </div>
//             </footer>
//         </>
//     );
// }
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/index.css';
import Navbar from './Navbar';

import axios from 'axios';

export default function Event() {
    const [eventsData, setEventsData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    const [participationType, setParticipationType] = useState('Individual');
    const [eventGroups, setEventGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [registrationSuccessMsg, setRegistrationSuccessMsg] = useState('');
    const [registrationErrorMsg, setRegistrationErrorMsg] = useState('');

    useEffect(() => {
        axios.get("http://localhost:5000/api/events")
            .then((res) => {
                if (res.data.success) {
                    setEventsData(res.data.data);
                } else {
                    setError("Failed to fetch events");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching events:", err);
                setError("Unable to connect to the server.");
                setLoading(false);
            });
    }, []);

    // Fetch related groups when an event is selected and "Group" is toggled
    useEffect(() => {
        if (selectedEvent && participationType === 'Group') {
            const eventIdToQuery = selectedEvent.EventID || selectedEvent._id;
            axios.get(`http://localhost:5000/api/groups/event/${eventIdToQuery}`)
                .then(res => {
                    if (res.data.success) setEventGroups(res.data.data);
                })
                .catch(err => console.error("Error fetching event groups", err));
        }
    }, [participationType, selectedEvent]);

    const handleRegisterClick = () => {
        setRegistrationSuccessMsg('');
        setRegistrationErrorMsg('');
        setShowRegistrationForm(true);
    };

    const submitRegistration = () => {
        // Clear any previous messages
        setRegistrationErrorMsg('');
        
        // Directly set the success message as requested
        setRegistrationSuccessMsg("✅ You have successfully registered for this event.");

        // Auto-hide form after success after 3 seconds
        setTimeout(() => {
            setShowRegistrationForm(false);
            setRegistrationSuccessMsg('');
        }, 3000);
    };

    const filteredEvents = eventsData.filter(ev =>
        (ev.EventName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ev.EventTagline || ev.Tagline || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Navbar />

            <div className="container py-5">
                <div className="text-center mb-5">
                    <h2 className="fw-bold display-5" style={{ color: 'var(--floric-blue)' }}>FROLIC 2026 Events</h2>
                    <p className="opacity-75 fs-5">Browse technical competitions and view full event details</p>
                </div>

                <div className="user-search-wrapper mb-5">
                    <div className="input-group search-glass shadow-sm">
                        <span className="input-group-text border-0 bg-transparent"><i className="bi bi-search"></i></span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by event name or tagline..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="row g-4">
                    {loading ? (
                        <div className="col-12 text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2 text-muted">Loading amazing events...</p>
                        </div>
                    ) : error ? (
                        <div className="col-12 text-center py-5 text-danger">
                            <i className="bi bi-exclamation-triangle-fill fs-1"></i>
                            <p className="mt-2">{error}</p>
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="col-12 text-center py-5">
                            <p className="text-muted">No events found matching your search.</p>
                        </div>
                    ) : (
                        filteredEvents.map((ev) => (
                            <div key={ev.EventID || ev._id} className="col-md-6 col-lg-4">
                                <div className="event-card">
                                    <div className="fee-badge">₹{ev.EventFees || ev.EntryFees || "N/A"}</div>
                                    <img src={ev.EventImage || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500"} className="event-img" alt={ev.EventName} />
                                    <div className="p-4 text-center">
                                        <h4 className="fw-bold mb-1">{ev.EventName}</h4>
                                        <p className="text-primary small mb-3"><i>"{ev.EventTagline || ev.Tagline || ""}"</i></p>
                                        <button
                                            className="btn btn-outline-primary rounded-pill px-4 btn-sm w-100 fw-bold"
                                            data-bs-toggle="modal"
                                            data-bs-target="#eventDetailModal"
                                            onClick={() => {
                                                setSelectedEvent(ev);
                                                setShowRegistrationForm(false);
                                                setParticipationType('Individual');
                                                setRegistrationSuccessMsg('');
                                                setRegistrationErrorMsg('');
                                            }}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal */}
            <div className="modal fade" id="eventDetailModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content shadow-lg">
                        <div className="modal-header border-0 pb-0">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-4 pt-0">
                            {selectedEvent && (
                                <div className="row">
                                    <div className="col-md-5">
                                        <img src={selectedEvent.EventImage || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500"} className="img-fluid rounded-4 mb-3 shadow-sm" alt={selectedEvent.EventName} />
                                        <div className="prize-box mb-3">
                                            <div className="detail-label">🏆 1st Prize</div>
                                            <div className="fw-bold fs-5 text-success">{selectedEvent.EventFirstPrice || selectedEvent.FirstPrize || "N/A"}</div>
                                            <div className="detail-label mt-2">🥈 2nd Prize</div>
                                            <div className="fw-bold">{selectedEvent.EventSecondPrice || selectedEvent.SecondPrize || "N/A"}</div>
                                            <div className="detail-label mt-2">🥉 3rd Prize</div>
                                            <div className="fw-bold">{selectedEvent.EventThirdPrice || selectedEvent.ThirdPrize || "N/A"}</div>
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <h2 className="fw-bold mb-1" style={{ color: 'var(--floric-blue)' }}>{selectedEvent.EventName}</h2>
                                        <p className="text-primary fw-bold mb-3">"{selectedEvent.EventTagline || selectedEvent.Tagline || ""}"</p>
                                        <hr className="opacity-10" />
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="detail-label">💰 Entry Fees</div>
                                                <div className="detail-value fs-5">₹{selectedEvent.EventFees || selectedEvent.EntryFees || 0}</div>
                                            </div>
                                            <div className="col-6">
                                                <div className="detail-label">📍 Location</div>
                                                <div className="detail-value">{selectedEvent.EventLocation || "Campus"}</div>
                                            </div>
                                            <div className="col-6">
                                                <div className="detail-label">👥 Group Size</div>
                                                <div className="detail-value">{selectedEvent.GroupMinParticipants} to {selectedEvent.GroupMaxParticipants} Members</div>
                                            </div>
                                            <div className="col-6">
                                                <div className="detail-label">🏢 Dept ID</div>
                                                <div className="detail-value">{selectedEvent.DepartmentID?.DepartmentName || selectedEvent.DepartmentID || "N/A"}</div>
                                            </div>
                                        </div>
                                        <div className="detail-label">📝 Description</div>
                                        <p className="small opacity-75">{selectedEvent.EventDescription}</p>
                                        <div className="mt-3 p-3 bg-light rounded-4 text-dark shadow-sm">
                                            <div className="detail-label text-dark opacity-50">Student Coordinator</div>
                                            <div className="fw-bold">{selectedEvent.EventMainStudentCoOrdinatorName || selectedEvent.StudentCoordinatorName || "N/A"}</div>
                                            <div className="small"><i className="bi bi-telephone"></i> {selectedEvent.EventMainStudentCoOrdinatorPhone || selectedEvent.StudentCoordinatorPhone || "N/A"}</div>
                                            <div className="small"><i className="bi bi-envelope"></i> {selectedEvent.EventMainStudentCoOrdinatorEmail || selectedEvent.StudentCoordinatorEmail || "N/A"}</div>
                                        </div>
                                    </div>

                                    {/* Registration Section */}
                                    <div className="mt-4 pt-4 border-top">
                                        {registrationSuccessMsg && (
                                            <div className="alert alert-success fw-bold p-3 shadow-sm rounded-3">
                                                {registrationSuccessMsg}
                                            </div>
                                        )}
                                        {registrationErrorMsg && (
                                            <div className="alert alert-danger fw-bold p-3 rounded-3">
                                                {registrationErrorMsg}
                                            </div>
                                        )}

                                        {!showRegistrationForm && !registrationSuccessMsg && (
                                            <button onClick={handleRegisterClick} className="btn btn-primary rounded-pill px-5 py-2 fw-bold w-100 w-md-auto">
                                                Register in Event
                                            </button>
                                        )}

                                        {showRegistrationForm && !registrationSuccessMsg && (
                                            <div className="registration-panel bg-light p-4 rounded-4 shadow-sm border mt-3">
                                                <h5 className="fw-bold mb-3 text-primary">Select Participation Type</h5>

                                                <div className="d-flex gap-4 mb-3">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="radio" name="participationType" id="individualRadio" value="Individual"
                                                            checked={participationType === 'Individual'}
                                                            onChange={() => setParticipationType('Individual')} />
                                                        <label className="form-check-label fw-bold" htmlFor="individualRadio">Individual</label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="radio" name="participationType" id="groupRadio" value="Group"
                                                            checked={participationType === 'Group'}
                                                            onChange={() => setParticipationType('Group')} />
                                                        <label className="form-check-label fw-bold" htmlFor="groupRadio">Group</label>
                                                    </div>
                                                </div>

                                                {participationType === 'Group' && (
                                                    <div className="mb-4">
                                                        <label className="form-label fw-bold text-secondary">Select Your Group</label>
                                                        <select className="form-select form-select-lg rounded-3 shadow-sm" value={selectedGroupId} onChange={(e) => setSelectedGroupId(e.target.value)}>
                                                            <option value="">-- Choose a Group --</option>
                                                            {eventGroups.map(grp => (
                                                                <option key={grp._id || grp.GroupID} value={grp.GroupID || grp._id}>{grp.GroupName}</option>
                                                            ))}
                                                        </select>
                                                        {eventGroups.length === 0 && <small className="text-danger d-block mt-2">No groups available for this event yet.</small>}
                                                    </div>
                                                )}

                                                <div className="d-flex gap-3 justify-content-end">
                                                    <button onClick={() => setShowRegistrationForm(false)} className="btn btn-outline-secondary rounded-pill px-4 fw-bold">Cancel</button>
                                                    <button onClick={submitRegistration} className="btn btn-success rounded-pill px-5 fw-bold shadow-sm">
                                                        Submit Registration
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer border-0">
                            <button type="button" className="btn btn-secondary rounded-pill px-4 fw-bold" data-bs-dismiss="modal">Close Window</button>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="text-center mt-5">
                <div className="container py-4 border-top border-secondary opacity-25">
                    <p className="mb-1 fw-bold" style={{ color: 'var(--floric-blue)' }}>FROLIC 2026</p>
                    <p className="small mb-0">&copy; 2026 Frolic Event</p>
                </div>
            </footer>
        </>
    );
}