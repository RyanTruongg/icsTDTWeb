const getTimeTable = require('./scheduleTDT').getTimeTable;
const { writeFileSync } = require('fs');
const ics = require('ics');

let timeMap = {
  "------789-------": "Ca3",
  "---------012----": "Ca4",
  "---456----------": "Ca2",
  "123-------------": "Ca1",
  "-------89012----": "Ca3-4",
  "-23456----------": "Ca1-2",
  "12345----------": "Ca1-2",
  "------------345-": "Ca5"
};

module.exports.writeIcs = async (token, hocky) => {
  let data = (await getTimeTable({ token: token, hocKyID: hocky })).list;
  eventList = [];

  data.forEach(subj => {
    let name = subj.subjectName;
    subj.scheduleList.forEach(schedule => {
      weeks = schedule.studyWeek.split('');

      let room = schedule.room;
      let weekDay = schedule.weekDay;
      let period = timeMap[schedule.period];
      // console.log(timeMap[period]);
      console.log(period, schedule.period);


      let _Date = new Date("2021-06-07T00:00:00");
      _Date.setDate(_Date.getDate() + weekDay)
      weeks.forEach(week => {
        if (week != '-') {
          _event = {
            title: `${period} ${room.split(' ')[1]} ${name}`,
            start: [_Date.getFullYear(), _Date.getMonth() + 1, _Date.getDate()],
            duration: { days: 1 }
          }
          eventList.push(_event);
        }
        _Date.setDate(_Date.getDate() + 7)
      });
    });
  });

  const { error, value } = ics.createEvents(eventList)

  if (error) {
    console.log(error)
    return
  }

  writeFileSync(`${__dirname}/${token}.ics`, value)
};
