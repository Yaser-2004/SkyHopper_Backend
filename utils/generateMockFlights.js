// utils/generateMockFlights.js
const airlines = ["IndiGo", "SpiceJet", "Air India"];
const airlineCodes = { "IndiGo": "6E", "SpiceJet": "SG", "Air India": "AI" };

function getRandomTime() {
  const hour = Math.floor(Math.random() * 24).toString().padStart(2, '0');
  const minute = Math.floor(Math.random() * 60).toString().padStart(2, '0');
  return `${hour}:${minute}`;
}

function getRandomDuration() {
  const h = Math.floor(Math.random() * 4) + 1;
  const m = Math.floor(Math.random() * 60);
  return `${h}h ${m}m`;
}

function getRandomPrice() {
  return Math.floor(Math.random() * 1000) + 2000; // ₹2000–₹3000
}

function generateMockFlights(departureCity, arrivalCity, departureCityCode, arrivalCityCode) {
  const flights = [];

  for (let i = 0; i < 10; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const flightNumber = `${airlineCodes[airline]}${Math.floor(1000 + Math.random() * 9000)}`;

    const price = getRandomPrice();

    flights.push({
      id: `flight-${departureCity}-${arrivalCity}-${i}`,
      airline: airlineCodes[airline],
      flightNumber,
      departureCity: departureCity,
      departureCityCode: departureCityCode,
      arrivalCityCode: arrivalCityCode,
      arrivalCity: arrivalCity,
      departureTime: getRandomTime(),
      arrivalTime: getRandomTime(),
      duration: getRandomDuration(),
      price: price,
      currentPrice: price,
      stops: Math.floor(Math.random() * 2), // 0 or 1
      bookingAttempts: 0,
      lastBookedAt: null,
      lastResetAt: new Date()
    });
  }

  return flights;
}

export default generateMockFlights;
