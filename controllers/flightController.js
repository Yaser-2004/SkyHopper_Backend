import FlightModel from "../models/flightModel.js";
import generateMockFlights from "../utils/generateMockFlights.js";

export const searchFlights = async (req, res) => {
  const { departureCity, arrivalCity, departureCityCode, arrivalCityCode } = req.body;

  if (!departureCity || !arrivalCity) {
    return res.status(400).json({ error: "Both cities are required" });
  }

  try {
    // Step 1: Check if flights already exist for the route
    const existingFlights = await FlightModel.find({
      departureCity: departureCity,
      arrivalCity: arrivalCity,
    });

    if (existingFlights.length > 0) {
      return res.status(200).json(existingFlights);
    }

    // Step 2: If not found, generate and save new mock flights
    const mockFlights = generateMockFlights(departureCity, arrivalCity, departureCityCode, arrivalCityCode);

    await FlightModel.insertMany(mockFlights);

    return res.status(201).json(mockFlights);
  } catch (error) {
    console.error("Flight search error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
