/*
  Warnings:

  - You are about to drop the column `isHidden` on the `Template` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Template" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "explanation" TEXT,
    "isFork" BOOLEAN NOT NULL DEFAULT false,
    "originalId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "Template_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Template" ("authorId", "code", "createdAt", "explanation", "id", "isFork", "language", "originalId", "title", "updatedAt") SELECT "authorId", "code", "createdAt", "explanation", "id", "isFork", "language", "originalId", "title", "updatedAt" FROM "Template";
DROP TABLE "Template";
ALTER TABLE "new_Template" RENAME TO "Template";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
