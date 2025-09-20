export const CrowdController = {
  async submitReport(routeId, stop, status, userId = "anon", location = null) {
    try {
      const res = await fetch("https://backend-ridelogicai.onrender.com/crowd-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          routeId,
          stop,
          status,
          userId,
          location,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit report");
      return data;
    } catch (err) {
      console.error("Error submitting report:", err);
      return { success: false, error: err.message };
    }
  },

  async getReports(routeId, stop) {
    try {
      const params = new URLSearchParams();
      if (routeId) params.append("routeId", routeId);
      if (stop) params.append("stop", stop);

      const res = await fetch(`https://backend-ridelogicai.onrender.com/crowd-reports?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch reports");
      return data.reports;
    } catch (err) {
      console.error("Error fetching reports:", err);
      return [];
    }
  },
};
