const Role = require("../models/role.model");

// Get all roles
exports.get_all = (req, res, next) => {
    Role.find()
        .exec()
        .then((docs) => {
            const response = {
                count: docs.length,
                data: docs.map((doc) => {
                    return {
                        _id: doc._id,
                        name: doc.name
                    };
                }),
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

// Get a specific role by id
exports.get_role = (req, res, next) => {
    const id = req.params.roleId;
    Role.findById(id)
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


// Update role
exports.update_role = (req, res, next) => {
    const id = req.params.roleId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    //second param- how we want to update ($set)
    Role.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then((result) => {
            console.log(result);
            res.status(200).json({
                message: "Role updated",
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};

// Delete Role
exports.delete_role = (req, res, next) => {
    const id = req.params.roleId;
    Role.deleteOne({ _id: id })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: "Role deleted",
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
};