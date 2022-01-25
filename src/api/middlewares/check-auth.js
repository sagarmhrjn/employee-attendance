
const jwt = require("jsonwebtoken");
require('dotenv').config();

// Verify token
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[0];
        if (!token) {
            return res.status(403).send({ message: "No token provided!" });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized!",
        });
    }
};
