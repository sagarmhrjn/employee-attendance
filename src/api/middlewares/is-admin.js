const db = require("../models");
const User = db.user;
const Role = db.role;

// Check if user is admin
module.exports = (req, res, next) => {
    User.findById(req.userData.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        Role.findById({ _id: user.role },
            (err, role) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                if (role.name === "admin") {
                    next();
                    return;
                }
                res.status(403).send({ message: "Require Admin Role!" });
                return;
            }
        );
    });
};