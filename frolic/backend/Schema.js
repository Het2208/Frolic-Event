const mongoose = require('mongoose');

// Counter Schema
const CounterSchema = new mongoose.Schema({
    id: String,
    seq: Number
});
const Counter = mongoose.model('Counter', CounterSchema);

/* -------------------- Users -------------------- */
const UserSchema = new mongoose.Schema({
  UserID: { type: Number, unique: true },
  UserName: { type: String, maxlength: 100 },
  UserPassword: { type: String, maxlength: 300 },
  EmailAddress: { type: String, maxlength: 300 },
  PhoneNumber: { type: String, maxlength: 50 },
  IsAdmin: { type: Boolean }
});

UserSchema.pre("save", async function() {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { id: "UserID" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.UserID = counter.seq;
    }
});

/* -------------------- Institutes -------------------- */
const InstituteSchema = new mongoose.Schema({
  InstituteID: { type: Number, unique: true },
  InstituteName: { type: String, maxlength: 100 },
  InsituteImage: { type: String, maxlength: 300 },
  InsituteDescription: { type: String, maxlength: 1000 },
  InsituteCoOrdinatorID: { type: Number, ref: 'Users' },
  CreatedAt: { type: Date, default: Date.now },
  ModifiedAt: { type: Date, default: Date.now },
  ModifiedBy: { type: Number, ref: 'Users' }
});

InstituteSchema.pre("save", async function() {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { id: "InstituteID" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.InstituteID = counter.seq;
    }
});

/* -------------------- Departments -------------------- */
const DepartmentSchema = new mongoose.Schema({
  DepartmentID: { type: Number, unique: true },
  DepartmentName: { type: String, maxlength: 100 },
  DepartmentImage: { type: String, maxlength: 300 },
  DepartmentDescription: { type: String, maxlength: 1000 },
  InstituteID: { type: Number, ref: 'Institutes' },
  DepartmentCoOrdinatorID: { type: Number, ref: 'Users' },
  CreatedAt: { type: Date, default: Date.now },
  ModifiedAt: { type: Date, default: Date.now },
  ModifiedBy: { type: Number, ref: 'Users' }
});

DepartmentSchema.pre("save", async function() {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { id: "DepartmentID" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.DepartmentID = counter.seq;
    }
});

/* -------------------- Events -------------------- */
const EventSchema = new mongoose.Schema({
  EventID: { type: Number, unique: true },
  EventName: { type: String, maxlength: 100 },
  EventTagline: { type: String, maxlength: 300 },
  EventImage: { type: String, maxlength: 300 },
  EventDescription: { type: String, maxlength: 1000 },
  GroupMinParticipants: { type: Number },
  GroupMaxParticipants: { type: Number },
  EventFees: { type: Number },
  EventFirstPrice: { type: String, maxlength: 300 },
  EventSecondPrice: { type: String, maxlength: 300 },
  EventThirdPrice: { type: String, maxlength: 300 },
  DepartmentID: { type: Number, ref: 'Departments' },
  EventCoOrdinatorID: { type: Number, ref: 'Users' },
  EventMainStudentCoOrdinatorName: { type: String, maxlength: 100 },
  EventMainStudentCoOrdinatorPhone: { type: String, maxlength: 100 },
  EventMainStudentCoOrdinatorEmail: { type: String, maxlength: 300 },
  EventLocation: { type: String, maxlength: 100 },
  MaxGroupsAllowed: { type: Number },
  CreatedAt: { type: Date, default: Date.now },
  ModifiedAt: { type: Date, default: Date.now },
  ModifiedBy: { type: Number, ref: 'Users' }
});

EventSchema.pre("save", async function() {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { id: "EventID" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.EventID = counter.seq;
    }
});

/* -------------------- Groups -------------------- */
const GroupSchema = new mongoose.Schema({
  GroupID: { type: Number, unique: true },
  GroupName: { type: String, maxlength: 100 },
  EventID: { type: Number, ref: 'Events' },
  IsPaymentDone: { type: Boolean },
  IsPresent: { type: Boolean },
  CreatedAt: { type: Date, default: Date.now },
  ModifiedAt: { type: Date, default: Date.now },
  ModifiedBy: { type: Number, ref: 'Users' }
});

GroupSchema.pre("save", async function() {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { id: "GroupID" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.GroupID = counter.seq;
    }
});

/* -------------------- Participants -------------------- */
const ParticipantSchema = new mongoose.Schema({
  ParticipantID: { type: Number, unique: true },
  ParticipantName: { type: String, maxlength: 100 },
  ParticipantEnrollmentNumber: { type: String, maxlength: 100 },
  ParticipantInsituteName: { type: String, maxlength: 300 },
  ParticipantCity: { type: String, maxlength: 300 },
  ParticipantMobile: { type: String, maxlength: 100 },
  ParticipantEmail: { type: String, maxlength: 300 },
  IsGroupLeader: { type: Boolean },
  GroupID: { type: Number, ref: 'Groups' },
  CreatedAt: { type: Date, default: Date.now },
  ModifiedAt: { type: Date, default: Date.now },
  ModifiedBy: { type: Number, ref: 'Users' }
});

ParticipantSchema.pre("save", async function() {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { id: "ParticipantID" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.ParticipantID = counter.seq;
    }
});

/* -------------------- EventWiseWinners -------------------- */
const EventWiseWinnerSchema = new mongoose.Schema({
  EventWiseWinnerID: { type: Number, unique: true },
  EventID: { type: Number, ref: 'Events' },
  GroupID: { type: Number, ref: 'Groups' },
  Sequence: { type: Number },
  CreatedAt: { type: Date, default: Date.now },
  ModifiedAt: { type: Date, default: Date.now },
  ModifiedBy: { type: Number, ref: 'Users' }
});

EventWiseWinnerSchema.pre("save", async function() {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { id: "EventWiseWinnerID" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.EventWiseWinnerID = counter.seq;
    }
});

/* -------------------- Registrations -------------------- */
const RegistrationSchema = new mongoose.Schema({
  RegistrationID: { type: Number, unique: true },
  EventID: { type: Number, ref: 'Events' },
  ParticipantID: { type: Number, ref: 'Participants' },
  GroupID: { type: Number, ref: 'Groups' },
  RegistrationDate: { type: Date, default: Date.now }
});

RegistrationSchema.pre("save", async function() {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { id: "RegistrationID" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.RegistrationID = counter.seq;
    }
});

module.exports = {
  Counter,
  Users: mongoose.model('Users', UserSchema),
  Institutes: mongoose.model('Institutes', InstituteSchema),
  Departments: mongoose.model('Departments', DepartmentSchema),
  Events: mongoose.model('Events', EventSchema),
  Groups: mongoose.model('Groups', GroupSchema),
  Participants: mongoose.model('Participants', ParticipantSchema),
  EventWiseWinners: mongoose.model('EventWiseWinners', EventWiseWinnerSchema),
  Registrations: mongoose.model('Registrations', RegistrationSchema)
};