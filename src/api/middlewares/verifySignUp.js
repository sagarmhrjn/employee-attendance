const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

// Check duplicate email
const checkDuplicateEmail = (req, res, next) => {
    // Email
    User.findOne({ email: req.body.email }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (user) {
            res.status(400).send({ message: "Failed! Email is already in use!" });
            return;
        }
        next();
    });
};

// Check role existed
const checkRolesExisted = (req, res, next) => {
    if (req.body.role) {
        if (!ROLES.includes(req.body.role)) {
            res.status(400).send({
                message: `Failed! Role ${req.body.role} does not exist!`
            });
            return;
        }
    }
    next();
};

const verifySignUp = {
    checkDuplicateEmail,
    checkRolesExisted
};

module.exports = verifySignUp;