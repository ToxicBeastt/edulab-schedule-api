const prisma = require('../config/prisma');

exports.getStudentSchedule = async (req, res, next) => {
  try {
    const { class_code, date } = req.query;

    if (!class_code || !date) {
      return res.status(400).json({ error: 'class_code and date query parameters are required' });
    }

    const schedules = await prisma.schedule.findMany({
      where: {
        class_code: class_code,
        date: new Date(date)
      },
      orderBy: {
        jam_ke: 'asc'
      }
    });

    if (schedules.length === 0) {
      return res.json({
        class_name: null,
        date: date,
        jadwal: []
      });
    }

    const result = {
      class_name: schedules[0].class_name,
      date: date,
      jadwal: schedules.map(s => ({
        jam_ke: s.jam_ke,
        subject_code: s.subject_code,
        teacher_name: s.teacher_name,
        time_start: s.time_start,
        time_end: s.time_end
      }))
    };

    res.json(result);
  } catch (error) {
    next(error);
  }
};
