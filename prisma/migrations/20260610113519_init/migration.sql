-- CreateTable
CREATE TABLE "schedules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "class_code" TEXT NOT NULL,
    "class_name" TEXT NOT NULL,
    "subject_code" TEXT NOT NULL,
    "teacher_nik" TEXT NOT NULL,
    "teacher_name" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "jam_ke" INTEGER NOT NULL,
    "time_start" TEXT NOT NULL,
    "time_end" TEXT NOT NULL
);
