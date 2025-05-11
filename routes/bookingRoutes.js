// routes/bookingRoutes.js
import express from 'express';
import { bookFlight, bookFlightTrack } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/book', bookFlight);
router.post('/book/:flightId', bookFlightTrack);

export default router;

