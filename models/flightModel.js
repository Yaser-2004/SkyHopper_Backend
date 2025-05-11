import mongoose from 'mongoose';  

const flightSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // frontend ID
    airline: String,
    flightNumber: String,
    departureCity: String,
    departureCityCode: String,
    arrivalCityCode: String,
    arrivalCity: String,
    departureTime: String,
    arrivalTime: String,
    duration: String,
    price: Number, // static base price (e.g., 2500)
    currentPrice: Number, // price after dynamic pricing logic
    stops: Number,
    bookingAttempts: {
      count: { type: Number, default: 0 },
      lastAttemptTime: Date
    },
    lastBookedAt: Date, // helpful to revert after 10 mins
    lastResetAt: { type: Date, default: Date.now } // for resetting booking attempts
  }, { timestamps: true });
  
  

const FlightModel = mongoose.model('Flight', flightSchema);
export default FlightModel;

