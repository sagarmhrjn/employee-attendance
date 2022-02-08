const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require('dotenv').config();
const dbConfig = require('./configs/db.config');
const path = './client/dist/employee-attendance/';

// Mongoose connection
mongoose.connect(dbConfig.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

mongoose.Promise = global.Promise;

const roleRoutes = require("./api/routes/role.route");
const authRoutes = require("./api/routes/auth.route");
const userRoutes = require("./api/routes/user.route");
const attendanceRoutes = require("./api/routes/attendance.route");
const checkAuth = require("./api/middlewares/check-auth");
const isAdmin = require("./api/middlewares/is-admin");

// using morgan as a function
app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// using CORS (adding a header to allow access)
// CORS error only happen in the browser (not on postmon)
// stops other pages from accessing your API
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  //to send the browser's reply when we only want to see what headers we have
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use(express.static(path));

app.get('/', function (req, res) {
  res.sendFile(path + "index.html");
});

require("./seed/initial-user-role")
//routes which should handle requests
app.use("/rest/v1/roles", roleRoutes);
app.use("/rest/v1/auth", authRoutes);
app.use("/rest/v1/users", userRoutes);
app.use("/rest/v1/attendances", attendanceRoutes);


// if the incoming requests weren't handled
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 400;
  //forward the error to the next method
  next(error);
});

//will handle all the errors (for unmatching routes and DB fails)
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;