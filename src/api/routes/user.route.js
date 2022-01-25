const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

router.get("/", UserController.get_all);

router.get("/:userId", UserController.get_user);

// router.get("/:userId/attendances", UserController.get_user);

router.patch("/:userId/update", UserController.update_user);

router.delete("/:userId/delete", UserController.delete_user);

module.exports = router;