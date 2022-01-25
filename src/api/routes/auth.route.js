const express = require("express");
const router = express.Router();
const verifySignUp = require("../middlewares/verifySignUp");
const controller = require("../controllers/auth.controller");

router.post(
    "/signup",
    [
        verifySignUp.checkDuplicateEmail,
        verifySignUp.checkRolesExisted
    ],
    controller.signUp
);

router.post("/signin", controller.logIn);

module.exports = router;