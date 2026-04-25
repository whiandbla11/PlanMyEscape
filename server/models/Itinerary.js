import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
  name: String,
  description: String,
  duration: String,
  type: String,
  coordinates: {
    lat: Number,
    lng: Number,
  },
});

const daySchema = new mongoose.Schema({
  day: Number,
  theme: String,
  places: [placeSchema],
  food: [String],
  tips: String,
});

const itinerarySchema = new mongoose.Schema(
  {
    shareId: { type: String, unique: true, index: true },
    destination: String,
    duration: Number,
    overview: String,
    bestTimeToVisit: String,
    travelTips: [String],
    packingList: {
      essentials: [String],
      clothing: [String],
      documents: [String],
      electronics: [String],
    },
    emergencyInfo: {
      emergencyNumber: String,
      policeNumber: String,
      hospitalTip: String,
      embassyNote: String,
    },
    days: [daySchema],
    imageUrl: String,
    weather: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model('Itinerary', itinerarySchema);
