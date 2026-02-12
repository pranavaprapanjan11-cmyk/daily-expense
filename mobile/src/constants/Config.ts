/**
 * MISSION CRITICAL CONFIGURATION
 * Strict non-negotiable hardcoded variables.
 * NO process.env usage to ensure zero bundling/startup failures on Android.
 */

export const CONFIG = {
    // Production Railway API URL
    API_URL: "https://daily-expense-manager-production.up.railway.app/api"
};
