import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // For now, always point to your single user
  flight: { type: String, required: true },

  bookingTime: { type: Date, default: Date.now },
  amountPaid: { type: Number, required: true },

  passengerName: { type: String, required: true },  // Optional if user is fixed
  email: { type: String, required: true },          // For ticket confirmation
  ticketNumber: { type: String, required: true, unique: true }, // Random or hashed ID
  departureCity: { type: String, required: true }, // Optional if user is fixed
  departureCityCode: { type: String, required: true }, // Optional if user is fixed
  arrivalCity: { type: String, required: true },   // Optional if user is fixed
  arrivalCityCode: { type: String, required: true }, // Optional if user is fixed
  departureTime: { type: String, required: true }, // Optional if user is fixed
  arrivalTime: { type: String, required: true },   // Optional if user is fixed
  duration: { type: String, required: true },      // Optional if user is fixed
  airline: { type: String, required: true },       // Optional if user is fixed
  stops: { type: Number, required: true },         // Optional if user is fixed

}, { timestamps: true });

const BookingModel = mongoose.model('Booking', bookingSchema);
export default BookingModel;
