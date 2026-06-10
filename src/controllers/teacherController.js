const prisma = require('../config/prisma');

exports.getTeacherSchedule = async (req, res, next) => {
  try {
    const { teacher_nik, start_date, end_date } = req.query;

    if (!teacher_nik || !start_date || !end_date) {
      return res.status(400).json({ error: 'teacher_nik, start_date, and end_date query parameters are required' });
    }

    const schedules = await prisma.schedule.findMany({
      where: {
        teacher_nik: teacher_nik,
        date: {
          gte: new Date(start_date),
          lte: new Date(end_date)
        }
      },
      orderBy: [
        { date: 'asc' },
        { jam_ke: 'asc' }
      ]
    });

    if (schedules.length === 0) {
      return res.json({
        teacher_name: null,
        periode: {
          start_date,
          end_date
        },
        total_jp: 0,
        jadwal: []
      });
    }

    // Since each period (jam_ke) counts as 1 JP, total_jp is simply the number of records
    const total_jp = schedules.length;

    const result = {
      teacher_name: schedules[0].teacher_name,
      periode: {
        start_date,
        end_date
      },
      total_jp,
      jadwal: schedules.map(s => ({
        date: s.date.toISOString().split('T')[0],
        class_name: s.class_name,
        subject_code: s.subject_code,
        jam_ke: s.jam_ke,
        time_start: s.time_start,
        time_end: s.time_end
      }))
    };

    res.json(result);
  } catch (error) {
    next(error);
  }
};
