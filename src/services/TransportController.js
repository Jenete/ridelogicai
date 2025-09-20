// controllers/TransportController.js
import { askText } from './TranscribeAndChatService';
import {
  queryBusSchedule,
  queryFare,
  queryRouteInfo,
  queryRankLocation
} from './TransportDatabaseService'; // mock DB service

const intentResponses = {
  greeting: "👋 Hello! I'm RideLogic Bot, your transport assistant. Ask me about taxis, bus times, or fares!",
  gratitude: "🙏 You're welcome! Let me know if you need anything else.",
  unknown: "🤔 I'm not sure how to help with that. Try asking about taxi times, fares, or routes."
};

export async function handleUserTransportQuery(userPrompt, history = []) {
  const updatedHistory = [...history, { role: 'user', content: userPrompt }];
  
  try {
    const detailedPrompt = `
You are RideLogic Bot, an AI assistant helping people with Cape Town public transport. 
Understand the intent (e.g., next_bus, fare_inquiry, route_info, rank_location, greeting, gratitude, unknown), 
extract locations, time, and provide a clear, friendly response. 

If details are missing or the user greets or thanks, return a message in missingInfo.message.

User said: "${userPrompt}". History: ${JSON.stringify(history)}

Return a JSON object:
{
  intent: "next_bus" | "fare_inquiry" | "route_info" | "rank_location" | "greeting" | "gratitude" | "unknown",
  parameters: { fromLocation?: string, toLocation?: string, time?: string },
  missingInfo: { missing: boolean, message?: string }
}
`;

    const aiIntentResult = await askText(detailedPrompt, history);
    let parsed;
    
    try {
      parsed = JSON.parse(aiIntentResult);
    } catch {
      return {
        response: "⚠️ I couldn't fully understand that. Could you rephrase it?",
        history: [...updatedHistory, { role: 'system', content: "⚠️ I couldn't understand that." }]
      };
    }

    const { intent, parameters = {}, missingInfo = {} } = parsed;

    // 1. Handle greetings, thanks, etc
    if (intent === 'greeting' || intent === 'gratitude') {
      const reply = intentResponses[intent];
      return {
        response: reply,
        history: [...updatedHistory, { role: 'system', content: reply }]
      };
    }

    // 2. If info is missing
    if (missingInfo.missing) {
      return {
        response: `${missingInfo.message}`,
        history: [...updatedHistory, { role: 'system', content: `${missingInfo.message}` }]
      };
    }

    // 3. Handle known transport intents
    let result;
    switch (intent) {
      case 'next_bus':
        result = await queryBusSchedule(parameters.fromLocation, parameters.toLocation, parameters.time);
        break;
      case 'fare_inquiry':
        result = await queryFare(parameters.fromLocation, parameters.toLocation);
        break;
      case 'route_info':
        result = await queryRouteInfo(parameters.toLocation, parameters.fromLocation);
        break;
      case 'rank_location':
        result = await queryRankLocation(parameters.fromLocation || parameters.toLocation);
        break;
      case 'unknown':
      default:
        result = intentResponses.unknown;
        break;
    }

    return {
      response: `${result}`,
      history: [
        ...updatedHistory,
        { role: 'system', content: `${result}` }
      ]
    };

  } catch (err) {
    console.error("❌ handleUserTransportQuery error:", err);
    return {
      response: "🚨 Something went wrong while processing your request.",
      history: [
        ...updatedHistory,
        { role: 'system', content: "🚨 Something went wrong while processing your request." }
      ]
    };
  }
}
