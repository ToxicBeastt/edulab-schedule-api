-- CreateTable
CREATE TABLE "schedules" (
    "id" TEXT NOT NULL,
    "class_code" TEXT NOT NULL,
    "class_name" TEXT NOT NULL,
    "subject_code" TEXT NOT NULL,
    "teacher_nik" TEXT NOT NULL,
    "teacher_name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "jam_ke" INTEGER NOT NULL,
    "time_start" TEXT NOT NULL,
    "time_end" TEXT NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);
