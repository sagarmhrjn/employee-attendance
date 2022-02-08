const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const moment = require('moment');

const Attendance = require("../models/attendance.model");
const User = require("../models/user.model");

// Get all attendances
exports.get_all_attendances = (req, res, next) => {
    Attendance.find()
        .populate('user','-password -__v')
        .exec()
        .then((docs) => {
            const response = {
                count: docs.length,
                data: docs
            };
            res.status(200).json(response);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
};

// Get user attendances
exports.get_user_attendances = (req, res, next) => {
    const id = req.query.userId;
    Attendance.find({ user: id })
        .populate("user", "_id")
        .exec()
        .then((docs) => {
            if (docs) {
                res.status(200).json({
                    data: docs
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

// Create Attendance
exports.create_attendance = (req, res, next) => {
    //to see if userId already exists
    User.findById(req.body.userId)
        .then((user) => {
            //if user is null
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                });
            }
            const attendance = new Attendance({
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                status: req.body.status,
                remarks: req.body.remarks,
                user: req.body.userId,
            });
            return attendance.save();
        })
        .then((result) => {
            const createdAttendance = {
                _id: result._id,
                start_date: result.start_date,
                end_date: result.end_date,
                status: result.status,
                remarks: result.remarks,
                user: result.user,
            };
            console.log(result);
            res.status(201).json({
                message: "Attendance stored",
                createdAttendance: createdAttendance,
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};


// Create Attendance with auth
exports.create_attendance_with_auth = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email }).populate("role", "-__v").exec()
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email/password."
            });
        }
        const result = await bcrypt.compare(req.body.password, user.password);

        if (result) {
            const token = jwt.sign(
                {
                    email: user.email,
                    userId: user._id
                },
                process.env.SECRET_KEY,
                {
                    expiresIn: 86400 // 24 hours
                }
            );
            const today_start_date = moment().startOf('day').utc().format();
            const today_end_date = moment().endOf('day').utc().format();
            let check_in_date, check_out_date, status = 'present'

            today_attendance = await Attendance.findOne({
                user: user._id,
                createdAt: {
                    $gte: today_start_date, $lte: today_end_date
                }
            });

            if (!today_attendance) {
                if (req.body.check_in_out === 'check_out') {
                    return res.status(400).json({
                        message: 'You have not checked in yet, today. Would you like to check in?'
                    })
                }
                check_in_date = moment().utc().format();
                const attendance = new Attendance({
                    start_date: check_in_date,
                    end_date: check_out_date,
                    status: status,
                    remarks: req.body.remarks,
                    user: user.id,
                });

                await attendance.save();

                return res.status(201).json({
                    message: "Attendance stored",
                });
            } else {
                if (today_attendance.start_date) {
                    if (req.body.check_in_out === 'check_in') {
                        return res.status(400).json({
                            message: 'You have already checked in, Would you like to check out?'
                        })
                    }
                    check_in_date = today_attendance.start_date
                    check_out_date = moment().utc().format();
                } else {
                    if (req.body.check_in_out === 'check_out') {
                        return res.status(400).json({
                            message: 'You have not checked in yet!, Please check in.'
                        })
                    }
                    check_in_date = moment().utc().format();
                }
                const updateOps = {};

                for (const ops in req.body) {
                    updateOps[ops.propName] = ops.value;
                }
                updateOps['start_date'] = check_in_date
                updateOps['end_date'] = check_out_date
                updateOps['status'] = status

                await Attendance.updateOne({ _id: today_attendance._id }, { $set: updateOps })

                return res.status(201).json({
                    message: "Attendance updated.",
                });
            }
        }

        if (today_attendance.start_date && today_attendance.end_date) {
            return res.status(403).json({
                message: 'You have already submitted your attendance for today.'
            })
        }

        res.status(401).json({
            message: "Incorrect email/password."
        });
    } catch (err) {
        console.log(err);
        res.status(500)
            .json({ error: err });
    }

};
// Get Attendance
exports.get_attendance = async (req, res, next) => {
    const id = req.params.attendanceId;
    try {
        const attendanceDoc = await Attendance.findById(id);
        if (doc) {
            res.status(200).json({
                data: attendanceDoc,
            });
        } else {
            res.status(404)
                .json({ message: "No valid entry fount for provided ID" });
        }
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};

// Update Attendance
exports.update_attendance = async (req, res, next) => {
    const id = req.params.attendanceId;
    let today_start_date, today_end_date, today_attendance
    let check_in_date, check_out_date
    if (req.body.start_date) {
        today_start_date = moment(req.body.start_date).startOf('day').utc().format();
        today_end_date = moment(req.body.start_date).endOf('day').utc().format();
    } else {
        today_start_date = moment().startOf('day').utc().format();
        today_end_date = moment().endOf('day').utc().format();
    }
    console.log(today_start_date, today_end_date);
    try {
        today_attendance = await Attendance.findOne(
            {
                user: req.body.user,
                createdAt:
                {
                    $gte: today_start_date, $lte: today_end_date
                },
            }
        );

        if (today_attendance.start_date && today_attendance.end_date) {
            return res.status(403).json({
                message: 'You have already submitted your attendance for today.'
            })
        }
        if (today_attendance.start_date) {
            if (req.body.check_in_out === 'check_in') {
                return res.status(400).json({
                    message: 'You have already checked in, Would you like to check out?'
                })
            }
            check_in_date = today_attendance.start_date
            check_out_date = moment().utc().format();
        } else {
            if (req.body.check_in_out === 'check_out') {
                return res.status(400).json({
                    message: 'You have not checked in yet!, Please check in.'
                })
            }
            check_in_date = moment().utc().format();
        }
        const updateOps = {};

        for (const ops in req.body) {
            updateOps[ops.propName] = ops.value;
        }
        updateOps['start_date'] = check_in_date
        updateOps['end_date'] = check_out_date
        updateOps['status'] = 'present'

        const attendanceDoc = await Attendance.findOneAndUpdate({ _id: today_attendance._id }, { $set: updateOps }, { returnOriginal: false })
        res.status(200).json({
            message: "Attendance updated",
            data: attendanceDoc
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    }
};

// Delete Attendance
exports.delete_attendance = async (req, res, next) => {
    const id = req.params.attendanceId;
    try {
        await Attendance.deleteOne({ _id: id })

        res.status(200).json({
            message: "Attendnace deleted",
        });
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }

};