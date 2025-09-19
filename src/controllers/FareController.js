import { fares } from "../data/gabs_fares";
import { stringSimilarity } from "../utils/similarity";

export const FareController = {
  /**
   * Get all fares
   */
  getAllFares() {
    return fares;
  },

  /**
   * Get a fare by route (exact match)
   * @param routeName e.g, Belhar to Cape Town
   */
  getFareByRoute(routeName) {
    const farex = fares.find(f => stringSimilarity(f.route, routeName)>0.5)?.weekly_fare;
    if (!farex){
        return null;
    }
    const daily_fare = Math.floor(Number(farex)/10)+1;
    return daily_fare || null;
  },

  /**
   * Get fares that include a location (e.g., "Airport Industria")
   */
  getFaresByLocation(location) {
    return fares.filter(f =>
      f.route.toLowerCase().includes(location.toLowerCase())
    );
  },

  /**
   * Suggest routes that contain a query string
   */
  searchRoutes(query) {
    if (!query) return [];
    return fares
      .filter(f => f.route.toLowerCase().includes(query.toLowerCase()))
      .map(f => f.route);
  },

  /**
   * Get weekly fare for a route
   */
  getWeeklyFare(routeName) {
    const fare = this.getFareByRoute(routeName);
    return fare ? fare.weekly_fare : null;
  },

  /**
   * Get monthly fare for a route
   */
  getMonthlyFare(routeName) {
    const fare = this.getFareByRoute(routeName);
    return fare ? fare.monthly_fare : null;
  }
};
