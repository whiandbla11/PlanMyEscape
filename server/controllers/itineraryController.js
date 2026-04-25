import { nanoid } from 'nanoid';
import Itinerary from '../models/Itinerary.js';
import { generateItinerary, regenerateDay } from '../utils/gemini.js';
import { getWeather } from '../utils/weather.js';
import { getDestinationImage } from '../utils/unsplash.js';

export async function generate(req, res) {
  try {
    const { destination, days } = req.body;

    if (!destination || !days) {
      return res.status(400).json({ error: 'Destination and days are required' });
    }

    if (days < 2 || days > 14) {
      return res.status(400).json({ error: 'Days must be between 2 and 14' });
    }

    const [itineraryData, weather, imageUrl] = await Promise.all([
      generateItinerary(destination, days),
      getWeather(destination),
      getDestinationImage(destination),
    ]);

    const shareId = nanoid(10);

    const saved = await Itinerary.create({
      shareId,
      ...itineraryData,
      weather,
      imageUrl,
    });

    res.json({ shareId, itinerary: saved });
  } catch (err) {
    console.error('Generate error:', err);
    res.status(500).json({ error: 'Failed to generate itinerary. Please try again.' });
  }
}

export async function getShared(req, res) {
  try {
    const { shareId } = req.params;
    const itinerary = await Itinerary.findOne({ shareId });

    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    res.json({ itinerary });
  } catch (err) {
    console.error('Get shared error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function regenDay(req, res) {
  try {
    const { shareId, dayNumber } = req.body;

    const itinerary = await Itinerary.findOne({ shareId });
    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    const newDay = await regenerateDay(itinerary.destination, dayNumber, itinerary.duration);

    itinerary.days[dayNumber - 1] = newDay;
    itinerary.markModified('days');
    await itinerary.save();

    res.json({ day: newDay });
  } catch (err) {
    console.error('Regen day error:', err);
    res.status(500).json({ error: 'Failed to regenerate day. Please try again.' });
  }
}
