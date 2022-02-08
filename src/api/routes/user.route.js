const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const checkAuth = require("../middlewares/check-auth");
const isAdmin = require("../middlewares/is-admin");

router.get("/", UserController.get_all);

router.get("/:userId", UserController.get_user);

router.post("/:userId/attendances/create", UserController.create_employee_attendance);

router.patch("/:userId/update", [checkAuth, isAdmin], UserController.update_user);

router.delete("/:userId/delete", [checkAuth, isAdmin], UserController.delete_user);

module.exports = router;