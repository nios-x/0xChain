/*
  Warnings:

  - You are about to drop the column `alertType` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `isResolved` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `shipmentId` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `eventType` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `shipmentId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `shipmentId` on the `LocationLog` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedTime` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `riskScore` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `totalDistance` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `actualDelivery` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `currentLat` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `currentLocation` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `currentLon` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedDelivery` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `routeId` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Shipment` table. All the data in the column will be lost.
  - Added the required column `alert_type` to the `Alert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_type` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipment_id` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipment_id` to the `LocationLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimated_time` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_distance` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_shipmentId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_shipmentId_fkey";

-- DropForeignKey
ALTER TABLE "LocationLog" DROP CONSTRAINT "LocationLog_shipmentId_fkey";

-- DropForeignKey
ALTER TABLE "Shipment" DROP CONSTRAINT "Shipment_routeId_fkey";

-- DropIndex
DROP INDEX "Event_shipmentId_idx";

-- DropIndex
DROP INDEX "LocationLog_shipmentId_idx";

-- AlterTable
ALTER TABLE "Alert" DROP COLUMN "alertType",
DROP COLUMN "createdAt",
DROP COLUMN "isResolved",
DROP COLUMN "shipmentId",
ADD COLUMN     "alert_type" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_resolved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resolved_at" TIMESTAMP(3),
ADD COLUMN     "shipment_id" TEXT;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "eventType",
DROP COLUMN "shipmentId",
ADD COLUMN     "event_type" "EventType" NOT NULL,
ADD COLUMN     "shipment_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LocationLog" DROP COLUMN "shipmentId",
ADD COLUMN     "shipment_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Route" DROP COLUMN "estimatedTime",
DROP COLUMN "riskScore",
DROP COLUMN "totalDistance",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "estimated_time" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "risk_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "total_distance" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "actualDelivery",
DROP COLUMN "createdAt",
DROP COLUMN "currentLat",
DROP COLUMN "currentLocation",
DROP COLUMN "currentLon",
DROP COLUMN "estimatedDelivery",
DROP COLUMN "routeId",
DROP COLUMN "updatedAt",
ADD COLUMN     "actual_delivery" TIMESTAMP(3),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "current_lat" DOUBLE PRECISION,
ADD COLUMN     "current_location" TEXT,
ADD COLUMN     "current_lon" DOUBLE PRECISION,
ADD COLUMN     "estimated_delivery" TIMESTAMP(3),
ADD COLUMN     "route_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Alert_shipment_id_idx" ON "Alert"("shipment_id");

-- CreateIndex
CREATE INDEX "Event_shipment_id_timestamp_idx" ON "Event"("shipment_id", "timestamp");

-- CreateIndex
CREATE INDEX "LocationLog_shipment_id_idx" ON "LocationLog"("shipment_id");

-- CreateIndex
CREATE INDEX "Shipment_status_idx" ON "Shipment"("status");

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "Route"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "Shipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationLog" ADD CONSTRAINT "LocationLog_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
