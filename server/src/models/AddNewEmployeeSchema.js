// d:\Agaz foundation\AddNewEmployeeSchema.js

const mongoose = require('mongoose');

const addNewEmployeeSchema = new mongoose.Schema({
    empId: { type: String, unique: true }, // Unique Employee ID (e.g., EMP001)
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    designation: { type: String, required: true },
    district: String,
    state: String,
    block: String,
    panchayat: String,
    password: { type: String, required: true }, // Hashed Password
    isActive: { type: Boolean, default: true },
    deactivatedAt: { type: Date, default: null },
    activatedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
}, { collection: 'employees' }); // ✅ Explicitly set collection name

module.exports = mongoose.model('Employee', addNewEmployeeSchema);
