const prisma = require('../config/prisma');

exports.createSchedule = async (req, res, next) => {
  try {
    const { class_code, class_name, subject_code, teacher_nik, teacher_name, date, jam_ke, time_start, time_end } = req.body;
    
    // Deteksi Bentrok (Clash Detection)
    const scheduleDate = new Date(date);
    const clash = await prisma.schedule.findFirst({
      where: {
        date: scheduleDate,
        jam_ke: jam_ke,
        OR: [
          { class_code: class_code },
          { teacher_nik: teacher_nik }
        ]
      }
    });

    if (clash) {
      return res.status(409).json({ 
        error: 'Bentrok Jadwal Terdeteksi!', 
        detail: `Jadwal bentrok pada tanggal ${date} jam ke-${jam_ke}. ${clash.class_code === class_code ? 'Kelas' : 'Guru'} sudah memiliki jadwal.` 
      });
    }

    const schedule = await prisma.schedule.create({
      data: {
        class_code,
        class_name,
        subject_code,
        teacher_nik,
        teacher_name,
        date: scheduleDate,
        jam_ke,
        time_start,
        time_end
      }
    });
    res.status(201).json(schedule);
  } catch (error) {
    next(error);
  }
};


exports.getSchedules = async (req, res, next) => {
  try {
    const schedules = await prisma.schedule.findMany();
    res.json(schedules);
  } catch (error) {
    next(error);
  }
};

exports.updateSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const schedule = await prisma.schedule.update({
      where: { id },
      data: updateData
    });
    res.json(schedule);
  } catch (error) {
    next(error);
  }
};

exports.deleteSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.schedule.delete({
      where: { id }
    });
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    next(error);
  }
};
