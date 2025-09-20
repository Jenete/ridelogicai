// services/TransportDatabaseService.js

import { FareController } from "../controllers/FareController";

const database = {
  routes: [
    {
      id: '1',
      from: 'Makhaza',
      to: 'Cape Town',
      times: ['05:00', '06:30', '08:00', '10:00'],
      fare: 'R27',
      rank: 'Makhaza Taxi Rank near Makhaza Mall',
    },
    {
      id: '2',
      from: 'Site C',
      to: 'Bellville',
      times: ['06:00', '07:15', '09:00'],
      fare: 'R24',
      rank: 'Site C Rank opposite Police Station',
    },
    {
      id: '3',
      from: 'Khayelitsha',
      to: 'Wynberg',
      times: ['05:45', '07:00', '08:30'],
      fare: 'R18',
      rank: 'Khayelitsha Station Taxi Rank',
    },
    {
      id: '4',
      from: 'Dunoon',
      to: 'Cape Town',
      times: ['06:10', '07:40', '09:30'],
      fare: 'R20',
      rank: 'Dunoon Taxi Rank opposite Dunoon Clinic',
    },
    {
      id: '5',
      from: 'Langa',
      to: 'Century City',
      times: ['05:20', '06:45', '08:15'],
      fare: 'R19',
      rank: 'Langa Rank next to Station',
    },
    // Add more as needed
  ],
};

function simulateDelay(ms = 600) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function queryBusSchedule(from, to, time = null) {
  const navigationUrl = window.location.origin;
  return `Schedule from ${from} to ${to}: ${navigationUrl}/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&time=${encodeURIComponent(time || "")}`;
}


export async function queryFare(from, to) {

  const fare = FareController.getFareByRoute(`${from} to ${to}`);

  return fare
    ? `Fare from ${from} to ${to} is R${fare}. This may not be accurate.`
    : `Sorry, we couldn’t find fare info for ${from} to ${to}.`;
}

export async function queryRouteInfo(to, from) {
  await simulateDelay();

  const route = database.routes.find(
    (r) =>
      r.to.toLowerCase() === to.toLowerCase() &&
      r.from.toLowerCase() === from.toLowerCase()
  );

  return route
    ? `🗺️ Route from ${from} to ${to} usually departs from ${route.rank}. Typical times: ${route.times.join(', ')}.`
    : `❌ No direct route found from ${from} to ${to}. Try a nearby rank or destination.`;
}

export async function queryRankLocation(location) {
  await simulateDelay();

  const rankMatch = database.routes.find(
    (r) => r.from.toLowerCase() === location.toLowerCase()
  );

  return rankMatch
    ? `📍 ${location} Rank is located at: ${rankMatch.rank}.`
    : `❌ No taxi rank found in ${location}. Try checking surrounding areas.`;
}
