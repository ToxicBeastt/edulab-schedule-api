const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const scheduleController = require('../controllers/scheduleController');
const studentController = require('../controllers/studentController');
const teacherController = require('../controllers/teacherController');
const excelController = require('../controllers/excelController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Apply auth middleware to all routes in this router
router.use(authMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     Schedule:
 *       type: object
 *       required:
 *         - class_code
 *         - class_name
 *         - subject_code
 *         - teacher_nik
 *         - teacher_name
 *         - date
 *         - jam_ke
 *         - time_start
 *         - time_end
 *       properties:
 *         id:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         class_code:
 *           type: string
 *           example: "XA01"
 *         class_name:
 *           type: string
 *           example: "X-A"
 *         subject_code:
 *           type: string
 *           example: "BIO"
 *         teacher_nik:
 *           type: string
 *           example: "20222029"
 *         teacher_name:
 *           type: string
 *           example: "Najdin Aqmarina, S.Pd."
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-01-06"
 *         jam_ke:
 *           type: integer
 *           example: 1
 *         time_start:
 *           type: string
 *           example: "07:00:00"
 *         time_end:
 *           type: string
 *           example: "07:40:00"
 *
 *     StudentSchedule:
 *       type: object
 *       properties:
 *         class_name:
 *           type: string
 *           example: "X-A"
 *         date:
 *           type: string
 *           example: "2025-01-06"
 *         jadwal:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               jam_ke:
 *                 type: integer
 *                 example: 1
 *               subject_code:
 *                 type: string
 *                 example: "BIO"
 *               teacher_name:
 *                 type: string
 *                 example: "Najdin Aqmarina, S.Pd."
 *               time_start:
 *                 type: string
 *                 example: "07:00:00"
 *               time_end:
 *                 type: string
 *                 example: "07:40:00"
 *
 *     TeacherSchedule:
 *       type: object
 *       properties:
 *         teacher_name:
 *           type: string
 *           example: "Najdin Aqmarina, S.Pd."
 *         periode:
 *           type: object
 *           properties:
 *             start_date:
 *               type: string
 *               example: "2025-01-06"
 *             end_date:
 *               type: string
 *               example: "2025-01-10"
 *         total_jp:
 *           type: integer
 *           example: 20
 *         jadwal:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 example: "2025-01-06"
 *               class_name:
 *                 type: string
 *                 example: "X-A"
 *               subject_code:
 *                 type: string
 *                 example: "BIO"
 *               jam_ke:
 *                 type: integer
 *                 example: 1
 *               time_start:
 *                 type: string
 *                 example: "07:00:00"
 *               time_end:
 *                 type: string
 *                 example: "07:40:00"
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Unauthorized"
 *
 *     UploadResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Upload sukses, 50 baris data ditambahkan."
 *
 *     ExportResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Laporan berhasil dibuat"
 *         download_url:
 *           type: string
 *           example: "http://localhost:3000/reports/rekap_1712345678.xlsx"
 */

/**
 * @swagger
 * /api/schedules:
 *   post:
 *     summary: Create a new schedule
 *     tags: [Schedules]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - class_code
 *               - class_name
 *               - subject_code
 *               - teacher_nik
 *               - teacher_name
 *               - date
 *               - jam_ke
 *               - time_start
 *               - time_end
 *             properties:
 *               class_code:
 *                 type: string
 *                 example: "XA01"
 *               class_name:
 *                 type: string
 *                 example: "X-A"
 *               subject_code:
 *                 type: string
 *                 example: "BIO"
 *               teacher_nik:
 *                 type: string
 *                 example: "20222029"
 *               teacher_name:
 *                 type: string
 *                 example: "Najdin Aqmarina, S.Pd."
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-06"
 *               jam_ke:
 *                 type: integer
 *                 example: 1
 *               time_start:
 *                 type: string
 *                 example: "07:00:00"
 *               time_end:
 *                 type: string
 *                 example: "07:40:00"
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   get:
 *     summary: Get all schedules
 *     tags: [Schedules]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /api/schedules/{id}:
 *   put:
 *     summary: Update a schedule by ID
 *     tags: [Schedules]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               class_code:
 *                 type: string
 *                 example: "XA01"
 *               class_name:
 *                 type: string
 *                 example: "X-A"
 *               subject_code:
 *                 type: string
 *                 example: "BIO"
 *               teacher_nik:
 *                 type: string
 *                 example: "20222029"
 *               teacher_name:
 *                 type: string
 *                 example: "Najdin Aqmarina, S.Pd."
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-06"
 *               jam_ke:
 *                 type: integer
 *                 example: 1
 *               time_start:
 *                 type: string
 *                 example: "07:00:00"
 *               time_end:
 *                 type: string
 *                 example: "07:40:00"
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Schedule not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   delete:
 *     summary: Delete a schedule by ID
 *     tags: [Schedules]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Schedule deleted successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Schedule not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /api/schedules/student:
 *   get:
 *     summary: Get student schedule by class code and date
 *     tags: [Students]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: class_code
 *         required: true
 *         schema:
 *           type: string
 *         description: Class code
 *         example: "XA01"
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date
 *         example: "2025-01-06"
 *     responses:
 *       200:
 *         description: Student schedule
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentSchedule'
 *       400:
 *         description: Bad request - missing parameters
 *       401:
 *         description: Unauthorized
 *
 * /api/schedules/teacher:
 *   get:
 *     summary: Get teacher schedule by NIK and date range
 *     tags: [Teachers]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: teacher_nik
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher NIK
 *         example: "20222029"
 *       - in: query
 *         name: start_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date
 *         example: "2025-01-06"
 *       - in: query
 *         name: end_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date
 *         example: "2025-01-10"
 *     responses:
 *       200:
 *         description: Teacher schedule with total JP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeacherSchedule'
 *       400:
 *         description: Bad request - missing parameters
 *       401:
 *         description: Unauthorized
 *
 * /api/schedules/upload:
 *   post:
 *     summary: Upload schedules from Excel file
 *     tags: [Excel]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel file (.xlsx)
 *     responses:
 *       200:
 *         description: Upload successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 *
 * /api/schedules/export:
 *   get:
 *     summary: Export teacher JP recap as Excel report
 *     tags: [Excel]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: start_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date range
 *         example: "2025-01-06"
 *       - in: query
 *         name: end_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date range
 *         example: "2025-01-31"
 *     responses:
 *       200:
 *         description: Export report generated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExportResponse'
 *       400:
 *         description: Bad request - missing parameters
 *       401:
 *         description: Unauthorized
 */

// --- Excel Routes ---
router.post('/upload', upload.single('file'), excelController.uploadExcel);
router.get('/export', excelController.exportExcel);

// --- Specific Views Routes ---
router.get('/student', studentController.getStudentSchedule);
router.get('/teacher', teacherController.getTeacherSchedule);

// --- Basic CRUD Routes ---
router.post('/', scheduleController.createSchedule);
router.get('/', scheduleController.getSchedules);
router.put('/:id', scheduleController.updateSchedule);
router.delete('/:id', scheduleController.deleteSchedule);

module.exports = router;
