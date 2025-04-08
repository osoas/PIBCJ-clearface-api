/*
  Warnings:

  - You are about to drop the column `image_id` on the `Appointment` table. All the data in the column will be lost.
  - The `resultado` column on the `Appointment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `appointmentId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_image_id_fkey";

-- DropIndex
DROP INDEX "Appointment_image_id_key";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "image_id",
DROP COLUMN "resultado",
ADD COLUMN     "resultado" JSONB[];

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "appointmentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
