import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateItinerary(destination, days) {
  const prompt = `You are a professional travel planner. Generate a detailed ${days}-day itinerary for ${destination}.

Return ONLY a valid JSON object with NO markdown, NO code blocks, NO extra text. Use this exact structure:

{
  "destination": "Full city/place name, Country",
  "duration": ${days},
  "overview": "2-3 sentence engaging overview of the destination",
  "bestTimeToVisit": "Best months or season with brief reason",
  "travelTips": [
    "Practical tip 1",
    "Practical tip 2",
    "Practical tip 3",
    "Practical tip 4",
    "Practical tip 5"
  ],
  "packingList": {
    "essentials": ["item1", "item2", "item3", "item4", "item5"],
    "clothing": ["item1", "item2", "item3", "item4"],
    "documents": ["item1", "item2", "item3"],
    "electronics": ["item1", "item2", "item3"]
  },
  "emergencyInfo": {
    "emergencyNumber": "local emergency number",
    "policeNumber": "local police number",
    "hospitalTip": "One sentence tip about healthcare access",
    "embassyNote": "Indian embassy or consulate note if international, else 'Domestic travel - no embassy needed'"
  },
  "days": [
    {
      "day": 1,
      "theme": "Short catchy day title",
      "places": [
        {
          "name": "Exact place name",
          "description": "2 sentence description of what makes this place special",
          "duration": "X hours",
          "type": "monument or nature or food or museum or beach or market or religious",
          "coordinates": { "lat": 0.0000, "lng": 0.0000 }
        }
      ],
      "food": ["Local dish or restaurant suggestion 1", "suggestion 2"],
      "tips": "One useful tip specific to this day"
    }
  ]
}

Rules:
- Include 3-5 places per day. If days are fewer, include only the absolute top highlights.
- Coordinates must be accurate real-world latitude and longitude values.
- Keep descriptions informative but concise.
- Food suggestions should be local and specific, not generic.
- Return only the JSON, nothing else.`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });

  const text = response.choices[0].message.content;
  return JSON.parse(text);
}

export async function regenerateDay(destination, dayNumber, totalDays) {
  const prompt = `You are a professional travel planner. Generate an alternate Day ${dayNumber} itinerary for a ${totalDays}-day trip to ${destination}.

Return ONLY a valid JSON object with NO markdown, NO code blocks. Use this exact structure:

{
  "day": ${dayNumber},
  "theme": "Short catchy day title",
  "places": [
    {
      "name": "Exact place name",
      "description": "2 sentence description",
      "duration": "X hours",
      "type": "monument or nature or food or museum or beach or market or religious",
      "coordinates": { "lat": 0.0000, "lng": 0.0000 }
    }
  ],
  "food": ["Local dish or restaurant suggestion 1", "suggestion 2"],
  "tips": "One useful tip specific to this day"
}

Include 3-5 different places. Coordinates must be accurate.`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });

  const text = response.choices[0].message.content;
  return JSON.parse(text);
}
