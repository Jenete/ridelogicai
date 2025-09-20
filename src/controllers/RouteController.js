// src/controllers/RouteController.js
import { routes } from "../data/formatted_routes_v2";

export const RouteController = {
  /**
   * Get all unique stop names across all routes
   */
  getAllStops() {
    const stops = new Set();
    routes.forEach(r => r.stops.forEach(stop => stops.add(stop)));
    return Array.from(stops).sort();
  },

  /**
   * Suggest stops/routes based on a query string
   * (useful for search/autocomplete)
   */
  searchSuggestions(query) {
    if (!query) return [];

    const q = query.toLowerCase();

    // Match stops
    const stopMatches = this.getAllStops().filter(stop =>
      stop.toLowerCase().includes(q)
    );

    // Match routes by "from" / "to"
    const routeMatches = routes.filter(
      r =>
        r.from.toLowerCase().includes(q) ||
        r.to.toLowerCase().includes(q) ||
        r.route_id.toLowerCase().includes(q)
    );

    return {
      stops: stopMatches,
      routes: routeMatches.map(r => ({
        route_id: r.route_id,
        from: r.from,
        to: r.to,
        pdf: r.pdf,
        timetable: r.timetable,
      })),
    };
  },

  /**
 * Compute similarity between two strings using Levenshtein distance
 * Returns value between 0 and 1
 */
 stringSimilarity(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();

  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,       // deletion
        matrix[i][j - 1] + 1,       // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  const distance = matrix[a.length][b.length];
  const maxLen = Math.max(a.length, b.length);
  const result = 1 - distance / maxLen;
  
  return result;
},

/**
 * Get all routes that serve a given stop (fuzzy ≥ 90%)
 */
getRoutesByStop(stopName) {
  return routes.filter(r =>
    r.stops.some(stop => this.stringSimilarity(stop, stopName) >= 0.54)
  );
},


  /**
   * Get latest route info by route_id
   */
  getRouteById(routeId) {
    return routes.find(r => r.pdf?.toLowerCase() === routeId?.toLowerCase()) || null;
  },

  /**
   * Build URL for the PDF file (served by Flask backend)
   */
  getTimetableUrl(routeId, baseUrl = "https://backend-ridelogicai.onrender.com/file/") {
    const route = this.getRouteById(routeId);
    return route ? `${baseUrl}${route.pdf}` : null;
  },

  /**
   * Fetch a file from backend (as Blob)
   */
  async fetchTimetableFile(routeId) {
    const url = this.getTimetableUrl(routeId);
    console.log(url);
    if (!url) throw new Error("Timetable not found");

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch file: ${res.statusText}`);

    // Return blob so caller can display or download
    return await res.blob();
  },
};
