const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'floric_secret_key_123';

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/Frolic')
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.log('MongoDB Connection Error:', err));

const { Departments, Institutes, Events, Groups, Participants, Users, Winners, EventWiseWinners, Registrations } = require('./Schema.js');

// ------------------- Department.js Routes -------------------
app.get("/api/departments" , async(req,res)=>{
    try{
        const data = await Departments.find()
            .populate({ path: "InstituteID", foreignField: "InstituteID" })
            .populate({ path: "DepartmentCoOrdinatorID", foreignField: "UserID" })
            .populate({ path: "ModifiedBy", foreignField: "UserID" });
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get("/api/departments/:id" , async(req,res)=>{
    try{
        const data = await Departments.findOne({DepartmentID : Number(req.params.id)})
            .populate({ path: "InstituteID", foreignField: "InstituteID" })
            .populate({ path: "DepartmentCoOrdinatorID", foreignField: "UserID" })
            .populate({ path: "ModifiedBy", foreignField: "UserID" });
        if(!data) return res.status(404).json({ success: false, message: "No department found with "+req.params.id});
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get("/api/institutes/:id/departments" , async(req,res)=>{
    try{
        const inst = await Institutes.findOne({InstituteID: Number(req.params.id)});
        if (!inst) {
            return res.status(404).json({ success: false, message: "Institute not found" });
        }
        
        const data = await Departments.find({InstituteID : inst._id})
            .populate({ path: "InstituteID", foreignField: "InstituteID" })
            .populate({ path: "DepartmentCoOrdinatorID", foreignField: "UserID" })
            .populate({ path: "ModifiedBy", foreignField: "UserID" });
        res.status(200).json({ success: true, data });
    }   
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post("/api/departments" , async(req,res)=>{
    try{
        const data = new Departments(req.body);
        await data.save();
        res.status(201).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.put("/api/departments/:id" , async(req,res)=>{
    try{
        const data = await Departments.findOneAndUpdate({DepartmentID : Number(req.params.id)} , req.body , { new: true })
        if(!data) return res.status(404).json({ success: false, message: "No department found with "+req.params.id});
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.delete("/api/departments/:id" , async(req,res)=>{
    try{
        const data = await Departments.findOneAndDelete({DepartmentID : Number(req.params.id)});
        if(!data) return res.status(404).json({ success: false, message: "No department found with "+req.params.id});
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

// ------------------- Event.js Routes -------------------
app.get("/api/events" , async(req,res)=>{
    try{
        const data = await Events.find()
            .populate({ path: "DepartmentID", foreignField: "DepartmentID" })
            .populate({ path: "EventCoOrdinatorID", foreignField: "UserID" })
            .populate({ path: "ModifiedBy", foreignField: "UserID" });
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get("/api/events/:id" , async(req,res)=>{
    try{
        const data = await Events.findOne({EventID : Number(req.params.id)})
            .populate({ path: "DepartmentID", foreignField: "DepartmentID" })
            .populate({ path: "EventCoOrdinatorID", foreignField: "UserID" })
            .populate({ path: "ModifiedBy", foreignField: "UserID" });
        if(!data) return res.status(404).json({ success: false, message: "No Event Found With "+req.params.id});
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get("/api/departments/:id/events" , async(req,res)=>{
    try{
        const dept = await Departments.findOne({DepartmentID: Number(req.params.id)});
        if (!dept) return res.status(404).json({ success: false, message: "Department not found" });

        const data = await Events.find({DepartmentID : dept._id})
            .populate({ path: "DepartmentID", foreignField: "DepartmentID" })
            .populate({ path: "EventCoOrdinatorID", foreignField: "UserID" })
            .populate({ path: "ModifiedBy", foreignField: "UserID" });
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post("/api/events" , async(req,res)=>{
    try{
        if (req.body.GroupMinParticipants > req.body.GroupMaxParticipants) {
            return res.status(400).json({ success: false, message: "GroupMinParticipants cannot be greater than GroupMaxParticipants" });
        }
        if (req.body.MaxGroupsAllowed <= 0) {
            return res.status(400).json({ success: false, message: "MaxGroupsAllowed must be greater than 0" });
        }
        
        const data = new Events(req.body);
        await data.save();
        res.status(201).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.put("/api/events/:id" , async(req,res)=>{
    try{
        if (req.body.GroupMinParticipants && req.body.GroupMaxParticipants) {
            if (req.body.GroupMinParticipants > req.body.GroupMaxParticipants) {
                return res.status(400).json({ success: false, message: "GroupMinParticipants cannot be greater than GroupMaxParticipants" });
            }
        }
        if (req.body.MaxGroupsAllowed !== undefined && req.body.MaxGroupsAllowed <= 0) {
            return res.status(400).json({ success: false, message: "MaxGroupsAllowed must be greater than 0" });
        }

        const data = await Events.findOneAndUpdate({EventID : Number(req.params.id)} , req.body , {new : true});
        if(!data) return res.status(404).json({ success: false, message: "No Event Found With "+req.params.id});
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.delete("/api/events/:id" , async(req,res)=>{
    try{
        const data = await Events.findOneAndDelete({EventID : Number(req.params.id)});
        if(!data) return res.status(404).json({ success: false, message: "No Event found With "+req.params.id});
        res.status(200).json({ success: true, data });
    }   
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

// ------------------- Group.js Routes -------------------
app.get("/api/groups" , async(req,res)=>{
    try{
        const data = await Groups.find()
            .populate({ path: "EventID", foreignField: "EventID" })
            .populate({ path: "ModifiedBy", foreignField: "UserID" });
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get("/api/groups/:id" , async(req,res)=>{
    try{
        const data = await Groups.findOne({ GroupID: Number(req.params.id) })
            .populate({ path: "EventID", foreignField: "EventID" })
            .populate({ path: "ModifiedBy", foreignField: "UserID" });
        if(!data) return res.status(404).json({ success: false, message: "No Data Found" });
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get("/api/events/:eventId/groups" , async(req,res)=>{
    try{
        const event = await Events.findOne({ EventID: Number(req.params.eventId) });
        if(!event) return res.status(404).json({ success: false, message: "Event not found" });

        const data = await Groups.find({EventID : event._id})
            .populate({ path: "EventID", foreignField: "EventID" })
            .populate({ path: "ModifiedBy", foreignField: "UserID" });
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post("/api/groups" , async(req,res)=>{
    try{
        const data = new Groups(req.body);
        await data.save();
        res.status(201).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post("/api/events/:eventId/groups" , async(req,res)=>{
    try{
        const event = await Events.findOne({ EventID: Number(req.params.eventId) });
        if(!event) return res.status(404).json({ success: false, message: "Event not found" });

        const data = new Groups({...req.body, EventID: event._id});
        await data.save();
        res.status(201).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.put("/api/groups/:id" , async(req,res)=>{
    try{
        const data = await Groups.findOneAndUpdate({GroupID : Number(req.params.id)} , req.body , {new : true});
        if(!data) return res.status(404).json({ success: false, message: "No Data Found With "+req.params.id});
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.delete("/api/groups/:id" , async(req,res)=>{
    try{
        const data = await Groups.findOneAndDelete({GroupID : Number(req.params.id)});
        if(!data) return res.status(404).json({ success: false, message: "No Data Found With "+req.params.id});
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

// ------------------- Institute.js Routes -------------------
app.get("/api/institutes" , async(req,res)=>{
    try{
        const data = await Institutes.find()
            .populate({ path: "InsituteCoOrdinatorID", foreignField: "UserID" })
            .populate({ path: "ModifiedBy", foreignField: "UserID" });
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get("/api/institutes/:id" , async(req,res)=>{
    try{
        const data = await Institutes.findOne({InstituteID : Number(req.params.id)})
            .populate({ path: "InsituteCoOrdinatorID", foreignField: "UserID" })
            .populate({ path: "ModifiedBy", foreignField: "UserID" });
        if(!data) return res.status(404).json({ success: false, message: `No institute found with ID ${req.params.id}` });
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post("/api/institutes" , async(req,res)=>{
    try{
        const exists = await Institutes.findOne({ InstituteName: req.body.InstituteName });
        if (exists) return res.status(400).json({ success: false, message: "Institute already exists" });

        const data = new Institutes(req.body);
        await data.save();
        res.status(201).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.put("/api/institutes/:id" , async(req,res)=>{
    try{
        const data = await Institutes.findOneAndUpdate(
            {InstituteID : Number(req.params.id)}, 
            req.body, 
            { new: true }
        );
        if(!data) return res.status(404).json({ success: false, message: "No Institute Found with "+ req.params.id});
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.delete("/api/institutes/:id" , async(req,res)=>{
    try{
        const data = await Institutes.findOneAndDelete({InstituteID : Number(req.params.id)});
        if(!data) return res.status(404).json({ success: false, message: "No Institute Found with "+ req.params.id});
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

// ------------------- Participant.js Routes -------------------
app.get("/api/participants" , async(req,res)=>{
    try{
        const data = await Participants.find()
            .populate({ path: "GroupID", foreignField: "GroupID" })
            .populate({ path: "ModifiedBy", foreignField: "UserID" });
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get("/api/participants/:id" , async(req,res)=>{
    try{
        const data = await Participants.findOne({ ParticipantID: Number(req.params.id) })
            .populate({ path: "GroupID", foreignField: "GroupID" })
            .populate({ path: "ModifiedBy", foreignField: "UserID" });
        if(!data) return res.status(404).json({ success: false, message: "No Data Found" });
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get("/api/groups/:groupId/participants" , async(req,res)=>{
    try{
        const grp = await Groups.findOne({ GroupID: Number(req.params.groupId) });
        if(!grp) return res.status(404).json({ success: false, message: "Group not found" });

        const data = await Participants.find({ GroupID: grp._id })
            .populate({ path: "GroupID", foreignField: "GroupID" })
            .populate({ path: "ModifiedBy", foreignField: "UserID" });
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post("/api/groups/:groupId/participants" , async(req,res)=>{
    try{
        const grp = await Groups.findOne({ GroupID: Number(req.params.groupId) });
        if(!grp) return res.status(404).json({ success: false, message: "Group not found" });

        const data = new Participants({...req.body, GroupID: grp._id});
        await data.save();
        res.status(201).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post("/api/participants" , async(req,res)=>{
    try{
        const data = new Participants(req.body);
        await data.save();
        res.status(201).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.put("/api/participants/:id" , async(req,res)=>{
    try{
        const data = await Participants.findOneAndUpdate({ParticipantID : Number(req.params.id)} , req.body , {new : true});
        if(!data) return res.status(404).json({ success: false, message: "No Data Found with "+req.params.id});
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.delete("/api/participants/:id" , async(req,res)=>{
    try{
        // Fixing typo in original code that was using findOneAndUpdate to delete
        const data = await Participants.findOneAndDelete({ParticipantID : Number(req.params.id)});
        if(!data) return res.status(404).json({ success: false, message: "No Data Found With "+req.params.id});
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

// ------------------- User.js Routes -------------------
/* GET ALL USERS */
app.get("/api/users", async (req, res) => {
  try {
    const data = await Users.find();
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* GET USER BY ID */
app.get("/api/users/:id", async (req, res) => {
  try {
    const data = await Users.findOne({ UserID: Number(req.params.id) });
    if (!data) return res.status(404).json({ success: false, message: `No data found with ${req.params.id}` });
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ADD USER */
app.post("/api/user/add", async (req, res) => {
  try {
    const data = new Users(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* UPDATE USER */
app.put("/api/user/:id", async (req, res) => {
  try {
    const data = await Users.findOneAndUpdate(
      { UserID: Number(req.params.id) },
      req.body,
      { new: true }
    );
    if (!data) return res.status(404).json({ success: false, message: `No data found with ${req.params.id}` });
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* DELETE USER */
app.delete("/api/user/:id", async (req, res) => {
  try {
    const data = await Users.findOneAndDelete({ UserID: Number(req.params.id) });
    if (!data) return res.status(404).json({ success: false, message: `No data found with ${req.params.id}` });
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* LOGIN ENDPOINT */
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and Password are required" });
        }

        const user = await Users.findOne({ EmailAddress: email });
        
        if (!user || user.UserPassword !== password) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const payload = {
            id: user.UserID,
            role: user.IsAdmin ? 'admin' : 'user'
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.UserID,
                name: user.UserName,
                email: user.EmailAddress,
                role: payload.role
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});



// ------------------- Winner.js Routes -------------------
app.get("/api/winners" , async(req,res)=>{
    try{
        const data = await EventWiseWinners.find()
            .populate({ path: "EventID", foreignField: "EventID" })
            .populate({ path: "GroupID", foreignField: "GroupID" })
            .populate({ path: "ModifiedBy", foreignField: "UserID" });
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get("/api/winners/:id" , async(req,res)=>{
    try{
        const data = await EventWiseWinners.findOne({ EventWiseWinnerID: Number(req.params.id) })
            .populate({ path: "EventID", foreignField: "EventID" })
            .populate({ path: "GroupID", foreignField: "GroupID" })
            .populate({ path: "ModifiedBy", foreignField: "UserID" });
        if(!data) return res.status(404).json({ success: false, message: "No Data Found" });
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get("/api/events/:eventId/winners" , async(req,res)=>{
    try{
        const event = await Events.findOne({ EventID: Number(req.params.eventId) });
        if(!event) return res.status(404).json({ success: false, message: "Event not found" });

        const data = await EventWiseWinners.find({EventID : event._id})
            .populate({ path: "EventID", foreignField: "EventID" })
            .populate({ path: "GroupID", foreignField: "GroupID" })
            .populate({ path: "ModifiedBy", foreignField: "UserID" });
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
})

app.post("/api/events/:eventId/winners" , async(req,res)=>{
    try{
        const event = await Events.findOne({ EventID: Number(req.params.eventId) });
        if(!event) return res.status(404).json({ success: false, message: "Event not found" });

        const data = new EventWiseWinners({...req.body , EventID: event._id});
        await data.save();
        res.status(201).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post("/api/winners" , async(req,res)=>{
    try{
        const data = new EventWiseWinners(req.body);
        await data.save();
        res.status(201).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.put("/api/winners/:id" , async(req,res)=>{
    try{
        const data = await EventWiseWinners.findOneAndUpdate({EventWiseWinnerID : Number(req.params.id)} , req.body , {new : true});
        if(!data) return res.status(404).json({ success: false, message: "No Data Found With "+req.params.id});
        res.status(200).json({ success: true, data });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

app.delete("/api/winners/:id" , async(req,res)=>{
    try{
        const data = await EventWiseWinners.findOneAndDelete({EventWiseWinnerID : Number(req.params.id)});
        if(!data) return res.status(404).json({ success: false, message: "No Data Found With "+req.params.id});
        res.status(200).json({ success: true, data }); 
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
});

// ------------------- Dashboard Analytics Routes -------------------
app.get("/api/dashboard/stats", async (req, res) => {
    try {
        const [institutes, departments, events, participants, groups, winners] = await Promise.all([
            Institutes.countDocuments(),
            Departments.countDocuments(),
            Events.countDocuments(),
            Participants.countDocuments(),
            Groups.countDocuments(),
            EventWiseWinners.countDocuments()
        ]);
        
        res.status(200).json({
            success: true,
            data: {
                Institutes: institutes,
                Departments: departments,
                Events: events,
                Participants: participants,
                Groups: groups,
                Winners: winners
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ------------------- Event Registration Routes -------------------

// FETCH EVENT-SPECIFIC GROUPS FOR DROPDOWN
app.get("/api/groups/event/:eventId", async (req, res) => {
    try {
        const eventIdParam = Number(req.params.eventId);
        // Find Groups where the EventID matches exactly
        const data = await Groups.find()
            .populate({ path: "EventID", foreignField: "EventID" });
            
        // Filter out those matching because DB references use _id vs ID differently in this project setup.
        // Easiest is to manually filter populate if EventID mapping wasn't strict.
        const filteredGroups = data.filter(grp => grp.EventID && (grp.EventID.EventID === eventIdParam || grp.EventID === eventIdParam));
        
        res.status(200).json({ success: true, data: filteredGroups });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST REGISTRATION
app.post("/api/event-registration", async (req, res) => {
    try {
        const { eventID, participantID, groupID } = req.body;
        
        // Find related MongoDB _ids to construct references.
        const event = await Events.findOne({ EventID: Number(eventID) });
        const participant = await Participants.findOne({ ParticipantID: Number(participantID) });
        
        if (!event || !participant) {
            return res.status(404).json({ success: false, message: "Valid Event or Participant ID required." });
        }
        
        let mongoGroupId = null;
        if (groupID) {
            const group = await Groups.findOne({ GroupID: Number(groupID) });
            if (group) {
                mongoGroupId = group._id;
            }
        }

        const registration = new Registrations({
            EventID: event._id,
            ParticipantID: participant._id,
            GroupID: mongoGroupId
        });
        
        await registration.save();
        res.status(201).json({ success: true, data: registration, message: "Registration successful!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log('Backend Server started on port ' + PORT));
