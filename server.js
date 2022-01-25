const http = require("http");
const app = require("./src/app");
require('dotenv').config();
const updateAttendanceJob = require("./src/jobs/update-attendance-job")
const createAttendanceJob = require("./src/jobs/create-attendance-job")
const port = process.env.PORT || 3000;

const server = http.createServer(app);
server.listen(port, () => {
    console.log(`app is listening on port ${port}!`)
    createAttendanceJob();
    updateAttendanceJob();
});
