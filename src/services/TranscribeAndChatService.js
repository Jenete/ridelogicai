// services/TranscribeAndChatService.js

import { RouteController } from "../controllers/RouteController";

const OPENAI_API_KEY = "key";

export async function transcribeAudio(file) {
  const formData = new FormData();
  formData.append('file', file, 'recording.webm'); // Add name to ensure MIME type is inferred
  formData.append('model', 'whisper-1');
  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to transcribe audio');
  const data = await response.json();
  return data.text;
}


const times = [
  {
    bus_route: "Atlantis <-> Mamre",
    destination: "ATLANTIS",
    details: "Bus Atlantis <-> Mamre will arrive in MAMRE at:   --  ,   --   , via   , 05:30 ",
    times: ["  --  ", "  --   ", "via   ", "05:30 "],
    user_location: "MAMRE"
  },
  {
    bus_route: "Atlantis <-> Mamre",
    destination: "ATLANTIS",
    details: "Bus Atlantis <-> Mamre will arrive in MAMRE at:   --  ,   --   , via   , 05:30 ",
    times: ["  --  ", "  --   ", "via   ", "05:30 "],
    user_location: "MAMRE"
  },
  {
    bus_route: "Atlantis <-> Epping Ind",
    destination: "ATLANTIS",
    details: "Bus Atlantis <-> Epping Ind will arrive in MAMRE at:   --  ,   --   , via   , 05:30 ",
    times: ["  --  ", "  --   ", "via   ", "05:30 "],
    user_location: "MAMRE"
  },
  {
    bus_route: "Atlantis <-> Epping Ind",
    destination: "ATLANTIS",
    details: "Bus Atlantis <-> Epping Ind will arrive in MAMRE at:   --  ,   --   , via   , 05:30 ",
    times: ["  --  ", "  --   ", "via   ", "05:30 "],
    user_location: "MAMRE"
  }
];

export async function askGptFromText(prompt, history = []) {
  const detailedPrompt = `You are a helpful AI transport assistant for RideLogic. Your name is RideLogic Bot. Your task is to understand and answer questions related to Cape Town public transport including taxis, bus schedules (MiCiti and Golden arrow), fares, routes, and rank locations. Respond to: "${prompt}"`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are RideLogic, a helpful assistant that gives real-time, friendly advice about taxi and bus transport in South Africa.' },
        { role: 'user', content: detailedPrompt },
      ],
    }),
  });

  if (!res.ok) throw new Error('Failed to get response from GPT');
  const data = await res.json();
  return data.choices[0].message.content;
}

// src/controllers/chatController.js

export async function askText(prompt, history = []) {
  try {
    const res = await fetch("https://backend-ridelogicai.onrender.com/ask-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, history }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Server error");

    return data.response;
  } catch (err) {
    console.error("askText error:", err);
    throw err;
  }
}



const fileCache = new Map(); // cache: filename → file_id

export async function getBestTimesFromTimetable(pdfUrls, time, whereto, fromWhere) {
  const detailedPrompt = `
You are a helpful AI transport assistant for RideLogic. 
Your name is RideLogic Bot.
Your task is to understand and answer questions related to Cape Town public transport 
including taxis, bus schedules (MiCiti and Golden Arrow), fares, routes, and rank locations.
  
The user query:
Find the best available bus at ${time} from ${fromWhere} to ${whereto}.
Use the uploaded timetable(s) as the source of truth. Keep it short. Provide two version xhosa expanation and english explanation.
  `;

  if (!pdfUrls || pdfUrls.length === 0) {
    throw new Error("No timetable files provided.");
  }

  try {
    // Upload files in parallel if not cached
    const uploadPromises = pdfUrls.map(async (url) => {
      if (fileCache.has(url)) {
        return fileCache.get(url); // return cached file_id
      }

      // Fetch timetable blob
      const blob = await RouteController.fetchTimetableFile(url);
      const file = new File([blob], url, { type: "application/pdf" });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("purpose", "assistants");

      const uploadRes = await fetch("https://api.openai.com/v1/files", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: formData,
      });

      if (!uploadRes.ok) throw new Error(`Failed to upload ${url}`);

      const uploaded = await uploadRes.json();
      fileCache.set(url, uploaded.id); // cache it
      return uploaded.id;
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    // Ask GPT with file context
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini", // file-aware + efficient
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: detailedPrompt },
              ...uploadedFiles.map((fid) => ({ type: "input_file", file_id: fid })),
            ],
          },
        ],
      }),
    });

    if (!response.ok) throw new Error("Failed to query GPT with timetables");

    const data = await response.json();
    return data.output_text || data.output?.[0]?.content?.[0]?.text || "No response.";
  } catch (err) {
    console.error("getBestTimesFromTimetable error:", err);
    throw err;
  }
}

export async function getBestTimes({ routeIds, time, to, from }) {
  try {
    const res = await fetch("https://backend-ridelogicai.onrender.com/best-times", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pdf_files: routeIds, // array of PDF file paths or names
        time,
        whereto: to,
        fromWhere: from,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Server error");

    return data.result;
  } catch (err) {
    console.error("getBestTimes error:", err);
    throw err;
  }
}
