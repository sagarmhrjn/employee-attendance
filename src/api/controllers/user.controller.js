const User = require("../models/user.model");
const Role = require("../models/role.model");
// Get all users
exports.get_all = async (req, res, next) => {
    try {
        const docs = await User.find().select("-__v -password")
        const response = {
            count: docs.length,
            data: docs
        };
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    }
};

// Get a specific user by id
exports.get_user = (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        .select('_id first_name last_name email createdAt updatedAt role')
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

// Update user
exports.update_user = async (req, res, next) => {
    const id = req.params.userId;
    updatedOps = req.body.data
    const role = await Role.findOne({ name: updatedOps.role })
    updatedOps.role = role._id
    //second param- how we want to update ($set)
    try {
        const userDoc = await User.findOneAndUpdate({ _id: id }, { $set: updatedOps }, { returnOriginal: false })

        res.status(200).json({
            message: "User updated",
            data: userDoc
        });
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};

// Delete User
exports.delete_user = (req, res, next) => {
    const id = req.params.userId;
    User.deleteOne({ _id: id })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: "User deleted",
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
};