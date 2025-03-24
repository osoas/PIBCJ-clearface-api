/*
  Warnings:

  - You are about to drop the column `appointment_id` on the `Image` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[image_id]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `image_id` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_appointment_id_fkey";

-- DropIndex
DROP INDEX "Image_appointment_id_key";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "image_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "appointment_id";

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_image_id_key" ON "Appointment"("image_id");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
