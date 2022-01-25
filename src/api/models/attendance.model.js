const mongoose = require("mongoose");

const attendanceSchema = mongoose.Schema({
    start_date: {
        type: Date,
    },
    end_date: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'missed'],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    remarks: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);