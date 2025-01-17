export function getWasteDescription(wasteCode: string) {
  return wasteCode === "16 01 06"
    ? "Véhicules hors d'usage ne contenant ni liquides ni autres composants dangereux"
    : wasteCode === "16 01 04*"
    ? "Véhicules hors d’usage non dépollué par un centre agréé"
    : "";
}
