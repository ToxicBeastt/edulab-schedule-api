const prisma = require('../config/prisma');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

exports.uploadExcel = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    
    const worksheet = workbook.getWorksheet(1);
    const schedules = [];
    
    // Assuming row 1 is header: class_code, class_name, subject_code, teacher_nik, teacher_name, date, jam_ke, time_start, time_end
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip header
        const values = row.values;
        // row.values is 1-indexed array
        if (values.length >= 10) {
           schedules.push({
             class_code: values[2]?.toString() || '',
             class_name: values[3]?.toString() || '',
             subject_code: values[4]?.toString() || '',
             teacher_nik: values[5]?.toString() || '',
             teacher_name: values[6]?.toString() || '',
             date: new Date(values[7]),
             jam_ke: parseInt(values[8]),
             time_start: values[9]?.toString() || '',
             time_end: values[10]?.toString() || ''
           });
        }
      }
    });

    if (schedules.length > 0) {
      // Prisma createMany is supported in SQLite for simple inserts without skipDuplicates
      await prisma.schedule.createMany({
        data: schedules
      });
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({ message: `Upload sukses, ${schedules.length} baris data ditambahkan.` });
  } catch (error) {
    if (req.file) {
       fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

exports.exportExcel = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'start_date and end_date query parameters are required' });
    }

    const schedules = await prisma.schedule.findMany({
      where: {
        date: {
          gte: new Date(start_date),
          lte: new Date(end_date)
        }
      },
      orderBy: { date: 'asc' }
    });

    // Process data to group by Teacher
    const teacherMap = new Map();
    const startDateObj = new Date(start_date);
    
    schedules.forEach(s => {
      const nik = s.teacher_nik;
      if (!teacherMap.has(nik)) {
        teacherMap.set(nik, {
          nik: nik,
          name: s.teacher_name,
          classes: new Set(),
          pekan: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          total: 0
        });
      }
      
      const t = teacherMap.get(nik);
      t.classes.add(s.class_name);
      
      // Calculate which pekan (week) this date falls into
      const diffTime = Math.abs(s.date - startDateObj);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      const weekNum = Math.floor(diffDays / 7) + 1;
      
      const pekanKey = weekNum <= 5 ? weekNum : 5; // Cap at 5 weeks max for this report
      t.pekan[pekanKey]++;
      t.total++;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Rekap JP Pengajar');

    // Add headers
    worksheet.columns = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'NIK', key: 'nik', width: 15 },
      { header: 'Nama Pengajar', key: 'name', width: 25 },
      { header: 'Kelas yg Diajar', key: 'classes', width: 20 },
      { header: 'Pekan 1', key: 'p1', width: 10 },
      { header: 'Pekan 2', key: 'p2', width: 10 },
      { header: 'Pekan 3', key: 'p3', width: 10 },
      { header: 'Pekan 4', key: 'p4', width: 10 },
      { header: 'Pekan 5', key: 'p5', width: 10 },
      { header: 'Total JP', key: 'total', width: 10 },
    ];
    
    // Merge cell for header "Total Jam Pelajaran Per Pekan" visually - simplified here just as columns
    
    // Add rows
    let rowNum = 1;
    for (const [nik, t] of teacherMap.entries()) {
      worksheet.addRow({
        no: rowNum++,
        nik: t.nik,
        name: t.name,
        classes: Array.from(t.classes).join(', '),
        p1: t.pekan[1],
        p2: t.pekan[2],
        p3: t.pekan[3],
        p4: t.pekan[4],
        p5: t.pekan[5],
        total: t.total
      });
    }

    // Ensure public/reports directory exists
    const reportsDir = path.join(__dirname, '../../public/reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const fileName = `rekap_${Date.now()}.xlsx`;
    const filePath = path.join(reportsDir, fileName);

    await workbook.xlsx.writeFile(filePath);

    // Get base URL for the response
    const protocol = req.protocol;
    const host = req.get('host');
    const fullUrl = `${protocol}://${host}/reports/${fileName}`;

    res.json({
      message: "Laporan berhasil dibuat",
      download_url: fullUrl
    });
  } catch (error) {
    next(error);
  }
};
