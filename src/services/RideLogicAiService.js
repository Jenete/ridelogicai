// services/RideLogicAiService.js

const RideLogicAiService = {
  async getReply(message) {
    // Simulate a delay to mimic real API response
    await new Promise((resolve) => setTimeout(resolve, 800));

    const lower = message.toLowerCase();

    // Basic mock intent detection
    if (lower.includes("makhaza") && lower.includes("cape town")) {
      return "🚐 From Makhaza, you can take a taxi to Site C rank (R17), then transfer to a Cape Town taxi (~R27). Estimated total: R44.";
    }

    if (lower.includes("next bus") || lower.includes("next taxi")) {
      return "🚌 The next taxi from Site B to Cape Town departs at 14:45. Please be at the rank 10 mins early.";
    }

    if (lower.includes("how much") || lower.includes("fare")) {
      return "💸 Most taxi fares range from R12 to R30 depending on the distance and route.";
    }

    if (lower.includes("site c rank") || lower.includes("where is rank")) {
      return "📍 Site C rank is located along Govan Mbeki Road near the traffic circle. It’s a central hub for long-distance taxis.";
    }

    if (lower.includes("hi") || lower.includes("hello") || lower.includes("help")) {
      return "👋 Hi there! I can help you with fares, directions, taxi times, and more. Ask me anything.";
    }

    // Fallback
    return "🤖 I'm still learning. Please rephrase your question or ask about routes, fares, or taxi ranks.";
  }
};

export default RideLogicAiService;
