-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ContentItemType" AS ENUM ('LESSON', 'VOCABULARY', 'GRAMMAR', 'KANJI', 'KANA');

-- CreateEnum
CREATE TYPE "ContentAuditAction" AS ENUM ('PUBLISH', 'ARCHIVE');

-- CreateTable
CREATE TABLE "ContentLesson" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleVi" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleJa" TEXT NOT NULL,
    "descriptionVi" TEXT,
    "descriptionEn" TEXT,
    "descriptionJa" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "order" INTEGER NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentLesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentItem" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "ContentItemType" NOT NULL,
    "order" INTEGER NOT NULL,
    "sourceJa" TEXT NOT NULL,
    "reading" TEXT,
    "meaningVi" TEXT NOT NULL,
    "meaningEn" TEXT NOT NULL,
    "meaningJa" TEXT NOT NULL,
    "notesVi" TEXT,
    "notesEn" TEXT,
    "notesJa" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentAuditLog" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" "ContentAuditAction" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentLesson_slug_key" ON "ContentLesson"("slug");

-- CreateIndex
CREATE INDEX "ContentLesson_status_idx" ON "ContentLesson"("status");

-- CreateIndex
CREATE INDEX "ContentLesson_order_idx" ON "ContentLesson"("order");

-- CreateIndex
CREATE INDEX "ContentItem_status_idx" ON "ContentItem"("status");

-- CreateIndex
CREATE INDEX "ContentItem_type_idx" ON "ContentItem"("type");

-- CreateIndex
CREATE UNIQUE INDEX "ContentItem_lessonId_slug_key" ON "ContentItem"("lessonId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "ContentItem_lessonId_order_key" ON "ContentItem"("lessonId", "order");

-- CreateIndex
CREATE INDEX "ContentAuditLog_lessonId_idx" ON "ContentAuditLog"("lessonId");

-- CreateIndex
CREATE INDEX "ContentAuditLog_actorId_idx" ON "ContentAuditLog"("actorId");

-- AddForeignKey
ALTER TABLE "ContentItem" ADD CONSTRAINT "ContentItem_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "ContentLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentAuditLog" ADD CONSTRAINT "ContentAuditLog_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "ContentLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentAuditLog" ADD CONSTRAINT "ContentAuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
