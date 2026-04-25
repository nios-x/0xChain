/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Prediction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Route` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RouteNode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Shipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrackingLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_shipmentId_fkey";

-- DropForeignKey
ALTER TABLE "Prediction" DROP CONSTRAINT "Prediction_shipmentId_fkey";

-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_shipmentId_fkey";

-- DropForeignKey
ALTER TABLE "RouteNode" DROP CONSTRAINT "RouteNode_routeId_fkey";

-- DropForeignKey
ALTER TABLE "Shipment" DROP CONSTRAINT "Shipment_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "TrackingLog" DROP CONSTRAINT "TrackingLog_shipmentId_fkey";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "Prediction";

-- DropTable
DROP TABLE "Route";

-- DropTable
DROP TABLE "RouteNode";

-- DropTable
DROP TABLE "Shipment";

-- DropTable
DROP TABLE "TrackingLog";

-- DropTable
DROP TABLE "Vehicle";

-- DropEnum
DROP TYPE "EventType";

-- DropEnum
DROP TYPE "ShipmentStatus";

-- DropEnum
DROP TYPE "VehicleStatus";
