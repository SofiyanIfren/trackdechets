-- AlterTable
ALTER TABLE
  "default$default"."Form"
ADD
  COLUMN "transporterTransportMode" "default$default"."TransportMode";

-- AlterTable
ALTER TABLE
  "default$default"."TemporaryStorageDetail"
ADD
  COLUMN "transporterTransportMode" "default$default"."TransportMode";