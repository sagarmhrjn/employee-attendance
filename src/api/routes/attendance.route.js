const express = require("express");
const router = express.Router();
const AttendanceController = require("../controllers/attendance.controller");
const checkAuth = require('../middlewares/check-auth');

router.get("/", [checkAuth], AttendanceController.get_user_attendances);

router.get("/all", [checkAuth], AttendanceController.get_all_attendances);

router.post("/create", [checkAuth], AttendanceController.create_attendance);

router.post("/create_with_auth", AttendanceController.create_attendance_with_auth);

router.get("/:attendanceId", [checkAuth], AttendanceController.get_attendance);

router.patch("/:attendanceId/update", [checkAuth], AttendanceController.update_attendance);

router.delete("/:attendanceId/delete", [checkAuth], AttendanceController.delete_attendance);

module.exports = router;