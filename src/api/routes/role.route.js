const express = require("express");
const router = express.Router();
const RoleController = require("../controllers/role.controller");
const checkAuth = require("../middlewares/check-auth");
const isAdmin = require("../middlewares/is-admin");

router.get("/", checkAuth, RoleController.get_all);

router.get("/:roleId", checkAuth, RoleController.get_role);

router.patch("/:roleId/update", [checkAuth, isAdmin], RoleController.update_role);

router.delete("/:roleId/delete", [checkAuth, isAdmin], RoleController.delete_role);

module.exports = router;