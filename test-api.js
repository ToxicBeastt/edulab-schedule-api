const fs = require('fs');
const FormData = require('form-data');
const ExcelJS = require('exceljs');
const axios = require('axios');

const API_KEY = 'SECRET123';
const BASE_URL = 'http://localhost:3000/api/schedules';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'x-api-key': API_KEY }
});

async function runTests() {
  console.log('=== STARTING TESTS ===\n');

  try {
    // 1. Create a schedule
    console.log('1. POST /api/schedules');
    const createRes = await axiosInstance.post('', {
      class_code: "XA01",
      class_name: "X-A",
      subject_code: "CHEM",
      teacher_nik: "20222029",
      teacher_name: "Najdin Aqmarina, S.Pd.",
      date: "2025-02-10",
      jam_ke: 2,
      time_start: "08:40:00",
      time_end: "09:20:00"
    });
    console.log(JSON.stringify(createRes.data, null, 2));

    // 2. Get Student Schedule
    console.log('\n2. GET /api/schedules/student');
    const studentRes = await axiosInstance.get('/student?class_code=XA01&date=2025-02-10');
    console.log(JSON.stringify(studentRes.data, null, 2));

    // 3. Get Teacher Schedule
    console.log('\n3. GET /api/schedules/teacher');
    const teacherRes = await axiosInstance.get('/teacher?teacher_nik=20222029&start_date=2025-02-10&end_date=2025-02-14');
    console.log(JSON.stringify(teacherRes.data, null, 2));

    // 4. Create dummy excel and test upload
    console.log('\n4. POST /api/schedules/upload');
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet1');
    sheet.addRow(['no', 'class_code', 'class_name', 'subject_code', 'teacher_nik', 'teacher_name', 'date', 'jam_ke', 'time_start', 'time_end']);
    sheet.addRow(['1', 'XB01', 'X-B', 'MATH', '20222029', 'Najdin Aqmarina, S.Pd.', '2025-02-11', '1', '07:30:00', '08:10:00']);
    const excelPath = 'test-data.xlsx';
    await workbook.xlsx.writeFile(excelPath);

    const fd = new FormData();
    fd.append('file', fs.createReadStream(excelPath));
    
    const uploadRes = await axiosInstance.post('/upload', fd, {
      headers: fd.getHeaders()
    });
    console.log(JSON.stringify(uploadRes.data, null, 2));

    // 5. Get Export Excel
    console.log('\n5. GET /api/schedules/export');
    const exportRes = await axiosInstance.get('/export?start_date=2025-02-10&end_date=2025-02-28');
    console.log(JSON.stringify(exportRes.data, null, 2));

  } catch (err) {
    console.error('Error during testing:', err.response?.data || err.message);
  }

  console.log('\n=== TESTS FINISHED ===');
}

runTests();
