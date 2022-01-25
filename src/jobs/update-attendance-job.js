const schedule = require('node-schedule');
const moment = require('moment');

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = new schedule.Range(1, 6);
rule.hour = 23;
rule.minute = 55;

const User = require('../api/models/user.model');
const Attendance = require('../api/models/attendance.model');

module.exports = () => {

  const job = schedule.scheduleJob(rule, async function () {
    console.log('Update attendance job');
    const today_start_date = moment().startOf('day').utc().format();
    const today_end_date = moment().endOf('day').utc().format();

    const users = await User.find();
    for await (const user of users) {
      today_attendance = await Attendance.findOne(
        {
          user: user._id,
          createdAt:
          {
            $gte: today_start_date, $lte: today_end_date
          },

        }
      );
      if (!today_attendance) {
        const attendance = new Attendance({
          status: 'absent',
          user: user._id,
        });
        await attendance.save();
      } else if (!today_attendance.end_date) {
        Attendance.updateOne(
          {
            _id: today_attendance._id
          },
          {
            $set: { status: 'missed' }
          }
        )
      }
    }

  });
}
