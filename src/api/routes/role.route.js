const express = require("express");
const router = express.Router();
const RoleController = require("../controllers/role.controller");

router.get("/", RoleController.get_all);

router.get("/:roleId", RoleController.get_role);

router.patch("/:roleId/update", RoleController.update_role);

router.delete("/:roleId/delete", RoleController.delete_role);

module.exports = router;