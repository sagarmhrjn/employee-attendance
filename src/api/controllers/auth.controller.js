const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const User = require("../models/user.model");
const Role = require("../models/role.model");

exports.signUp = async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: hash
        });
        await newUser.save();
        const role = req.body.role ? await Role.findOne({ name: req.body.role }) : await Role.findOne({ name: 'user' });
        newUser.role = role._id
        const userDoc = await newUser.save()
        res.status(201)
            .json({
                message: 'User was registered successfully.',
                data: userDoc
            });
    } catch (err) {
        res.status(500)
            .json({ error: err });
    }
};

exports.logIn = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }).populate("role", "-__v").exec()
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email/password."
            });
        }
        const result = await bcrypt.compare(req.body.password, user.password);

        if (result) {
            const token = jwt.sign(
                {
                    email: user.email,
                    userId: user._id,
                    roleId: user.role._id
                },
                process.env.SECRET_KEY,
                {
                    expiresIn: 86400 // 24 hours
                }
            );
            return res.status(200).json({
                id: user._id,
                email: user.email,
                role: user.role._id,
                accessToken: token
            });
        }
        res.status(401).json({
            message: "Incorrect email/password."
        });
    } catch (err) {
        res.status(500)
            .json({ error: err });
    }
};