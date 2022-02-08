const User = require("../models/user.model");
const Role = require("../models/role.model");
const Attendance = require("../models/attendance.model");
const moment = require('moment');

// Get all users
exports.get_all = async (req, res, next) => {
    try {
        const docs = await User.find()
            .populate('role')
            .select("-__v -password")
        const response = {
            count: docs.length,
            data: docs
        };
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    }
};

// Get a specific user by id
exports.get_user = (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        .select('_id first_name last_name email createdAt updatedAt role')
        .exec()
        .then((doc) => {
            if (doc) {
                res.status(200).json({
                    data: doc,
                });
            } else {
                res
                    .status(404)
                    .json({ message: "No valid entry fount for provided ID" });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
};

// Update user
exports.update_user = async (req, res, next) => {
    const id = req.params.userId;
    updatedOps = req.body.data
    const role = await Role.findOne({ name: updatedOps.role })
    updatedOps.role = role._id
    //second param- how we want to update ($set)
    try {
        const userDoc = await User.findOneAndUpdate({ _id: id }, { $set: updatedOps }, { returnOriginal: false })

        res.status(200).json({
            message: "User updated",
            data: userDoc
        });
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};

// Delete User
exports.delete_user = (req, res, next) => {
    const id = req.params.userId;
    User.deleteOne({ _id: id })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: "User deleted",
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
}
// Create employeeAttendance
exports.create_employee_attendance = async (req, res, next) => {
    //to see if userId already exists
    const user_id = req.params.userId;
    try {
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({
                message: "Employee not found",
            });
        }
        const date = req.body.date
        const start_date = moment(date).startOf('day').utc().format();
        const end_date = moment(date).endOf('day').utc().format();

        userAttendance = await Attendance.findOne({
            user: user._id,
            createdAt: {
                $gte: start_date, $lte: end_date
            }
        });
        if (!userAttendance) {
            let attendanceObj = {}
            const status = 'present';
            if (req.body.start_date && req.body.end_date) {
                attendanceObj['start_date'] = moment(req.body.start_date).utc().format();
                attendanceObj['end_date'] = moment(req.body.end_date).utc().format();
                attendanceObj['status'] = status
            } else if (req.body.start_date) {
                attendanceObj['start_date'] = req.body.start_date
                attendanceObj['status'] = status
            }
            attendanceObj['remarks'] = req.body.remarks
            attendanceObj['user'] = user._id
            console.log(attendanceObj);
            const createdAttendance = await new Attendance(attendanceObj).save();
            return res.status(201).json({
                message: "Attendance created",
                createdAttendance: createdAttendance,
            });
        } else {
            return res.status(400).json({
                message: "Attendance of" + ' ' + user.first_name + ' ' + user.last_name + ' ' + "has already been created.",
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err,
        });
    }
};