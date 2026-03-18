/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns distance in kilometers
 */
export function calculateDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Get estimated delivery time based on distance
 */
export function getEstimatedDelivery(distanceKm: number): string {
  if (distanceKm < 2) return '20–30 mins';
  if (distanceKm < 5) return '30–45 mins';
  if (distanceKm < 10) return '45–60 mins';
  return '1–2 hours';
}
