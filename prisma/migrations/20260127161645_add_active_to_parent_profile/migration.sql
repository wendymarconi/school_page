/*
  Warnings:

  - You are about to drop the column `parentId` on the `Student` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ParentStudent" (
    "parentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    PRIMARY KEY ("parentId", "studentId"),
    CONSTRAINT "ParentStudent_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ParentProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ParentStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Class" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "location" TEXT,
    "schedule" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Class_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "TeacherProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Class" ("id", "location", "name", "schedule", "teacherId") SELECT "id", "location", "name", "schedule", "teacherId" FROM "Class";
DROP TABLE "Class";
ALTER TABLE "new_Class" RENAME TO "Class";
CREATE TABLE "new_Grade" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL NOT NULL,
    "subject" TEXT,
    "description" TEXT,
    "type" TEXT,
    "period" INTEGER NOT NULL DEFAULT 1,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    CONSTRAINT "Grade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Grade_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Grade" ("classId", "date", "description", "id", "studentId", "subject", "value") SELECT "classId", "date", "description", "id", "studentId", "subject", "value" FROM "Grade";
DROP TABLE "Grade";
ALTER TABLE "new_Grade" RENAME TO "Grade";
CREATE TABLE "new_ParentProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "phone" TEXT,
    "relationship" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "ParentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ParentProfile" ("id", "userId") SELECT "id", "userId" FROM "ParentProfile";
DROP TABLE "ParentProfile";
ALTER TABLE "new_ParentProfile" RENAME TO "ParentProfile";
CREATE UNIQUE INDEX "ParentProfile_userId_key" ON "ParentProfile"("userId");
CREATE TABLE "new_Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Student" ("birthDate", "id", "name") SELECT "birthDate", "id", "name" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE TABLE "new_TeacherProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "TeacherProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TeacherProfile" ("id", "userId") SELECT "id", "userId" FROM "TeacherProfile";
DROP TABLE "TeacherProfile";
ALTER TABLE "new_TeacherProfile" RENAME TO "TeacherProfile";
CREATE UNIQUE INDEX "TeacherProfile_userId_key" ON "TeacherProfile"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
