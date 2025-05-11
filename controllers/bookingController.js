import UserModel from '../models/userModel.js';
import BookingModel from '../models/bookingModel.js';
import FlightModel from '../models/flightModel.js';

export const bookFlight = async (req, res) => {
  const { flight } = req.body;

  try {
    const user = await UserModel.findOne(); // Replace with actual user auth when needed

    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.wallet < flight.price) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    // Deduct wallet
    user.wallet -= flight.price;

    // Generate a unique ticket number
    const ticketNumber = `TKT-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;

    // Create booking with synced fields
    const newBooking = await BookingModel.create({
      user: user._id,
      flight: flight.id,
      amountPaid: flight.currentPrice,
      departureCity: flight.departureCity,
      departureCityCode: flight.departureCityCode,
      arrivalCity: flight.arrivalCity,
      arrivalCityCode: flight.arrivalCityCode,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      duration: flight.duration,
      airline: flight.airline,
      stops: flight.stops,
      passengerName: user.name,
      email: user.email,
      ticketNumber,
    });

    // Add booking reference to user
    user.bookings.push(newBooking._id);
    await user.save();

    res.status(200).json({ message: 'Booking successful', booking: newBooking });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Booking failed' });
  }
};


export const bookFlightTrack = async (req, res) => {
    try {
      const flight = await FlightModel.findOne({ id: req.params.flightId });
      if (!flight) return res.status(404).json({ message: 'Flight not found' });
  
      const now = new Date();
  
      // Reset attempts if last reset was more than 5 mins ago
      const lastAttempt = flight.bookingAttempts.lastAttemptTime || now;
      const timeSinceLast = now - new Date(lastAttempt);
  
      if (timeSinceLast > 5 * 60 * 1000) {
        flight.bookingAttempts.count = 1;
      } else {
        flight.bookingAttempts.count += 1;
      }
  
      flight.bookingAttempts.lastAttemptTime = now;
  
      // Apply surge pricing if >= 3 attempts in 5 minutes
      if (flight.bookingAttempts.count >= 3) {
        // Check if last surge was within 10 mins
        const lastSurge = flight.lastBookedAt;
        const surgeExpired = !lastSurge || now - new Date(lastSurge) > 10 * 60 * 1000;
  
        if (surgeExpired) {
          flight.currentPrice = Math.round(flight.price * 1.1);
          flight.lastBookedAt = now; // record surge start time
        }
      }
  
      // Revert price if 10 mins passed since last surge
      if (flight.lastBookedAt && now - new Date(flight.lastBookedAt) > 10 * 60 * 1000) {
        flight.currentPrice = flight.price;
        flight.lastBookedAt = null;
        flight.bookingAttempts.count = 1;
        flight.lastResetAt = now;
      }
  
      await flight.save();
  
      res.json({
        message: 'Dynamic pricing checked. Booking can proceed.',
        flightId: flight.id,
        price: flight.currentPrice || flight.price,
      });
    } catch (err) {
      console.error('Booking error:', err);
      res.status(500).json({ message: 'Server error' });
    }
}