const schedule = require('node-schedule');
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = new schedule.Range(1, 6);
rule.hour = 0;
rule.minute = 5;

const User = require('../api/models/user.model');
const Attendance = require('../api/models/attendance.model');

module.exports = () => {
    const job = schedule.scheduleJob(rule, async function () {
        console.log('Create Attendance Job');

        const users = await User.find();
        for await (const user of users) {
            today_attendance = new Attendance({
                user: user._id,
            });
            await today_attendance.save();
        }

    });
}
