import express from 'express';
import axios from 'axios';
import { cityToCode } from '../utils/codeTable.js';
const router = express.Router();

//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

router.post('/ask', async (req, res) => {
  const { message } = req.body;
  

  if (message.toLowerCase().includes("flights between")) {
    const regex = /flights between (\w+) and (\w+)/i;
    const match = message.match(regex);
  
    if (match) {
      const source = match[1];
      const destination = match[2];

      const sourceCode = cityToCode[source.toLowerCase()];
      const destinationCode = cityToCode[destination.toLowerCase()];
  
      // Call your actual backend API or DB here
      try {
        const flightRes = await axios.post(`${process.env.BASE_URL}/api/flights/save-flights`, {
            departureCity: source,
            arrivalCity: destination,
            departureCityCode: sourceCode,
            arrivalCityCode: destinationCode,
            headers: {
              'Content-Type': 'application/json',
            },
          });
        const flights = flightRes.data;
  
        if (!flights.length) {
          return res.json({ reply: `There are no flights from ${source} to ${destination} right now.` });
        }
  
        const formatted = flights.map(f => `✈️ *${f.airline}* - ${f.departureCity} to ${f.arrivalCity} at ${f.departureTime}, ₹${f.currentPrice}`).join('\n\n');
  
        return res.json({
          reply: `Here are some available flights from ${source} to ${destination}:\n\n${formatted}`
        });
      } catch (err) {
        console.error(err.message);
        return res.json({ reply: `Something went wrong while searching flights. Please try again.` });
      }
    }
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-small-3.1-24b-instruct:free', // free & fast model
        messages: [
          {
            role: 'system',
            content: `You are SkyBot, a friendly and intelligent AI assistant for the SkyHopper flight booking web application.

                        SkyHopper helps users search and book flights with advanced features like dynamic pricing, and wallet-based payments.

                        Here is what SkyHopper offers:

                        1. Flight Search & Booking
                        - Users can search flights between two cities by selecting source, destination, and departure date.
                        - Results show current prices, airline names, and flight details.
                        - Users can book a flight using their SkyHopper wallet.

                        2. Dynamic Pricing
                        - Flight prices increase if three booking attempts on a flight happen within 5 minutes.
                        - Price surge lasts 10 minutes and then returns to normal if there's no further activity.

                        3. Wallet System
                        - Each user has a wallet with a balance.
                        - Bookings are paid from the wallet.
                        - Wallet can be recharged by the user.

                        4. PDF Ticket Generation
                        - Once booked, users can download a PDF ticket for their flight.

                        5. Booking History
                        - Users can view all their past and upcoming bookings with flight details.

                        6. General Info
                        - The site is user-friendly, mobile-responsive, and secure.
                        - All bookings are stored in MongoDB, and real-time pricing is handled through dynamic backend logic.

                        Your goal is to:
                        - Help users understand how to use the platform.
                        - Answer questions about how the features work.
                        - Never make up features that don't exist.
                        - Be concise, helpful, and polite in tone.
                        - When responding with steps or instructions, format the message with markdown using numbered lists and bold headings for readability.

                        If you don't know something, suggest the user reach out to customer support or check the FAQ section.`,
          },
          {
            role: 'user',
            content: message,
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.SKYBOT_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Chatbot error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Chatbot failed. Try again later.' });
  }
});


export default router;
