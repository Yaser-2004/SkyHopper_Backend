import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import flightRoutes from './routes/flightRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatbotRoutes from './routes/chatbot.js';
import env from 'dotenv';


const app = express();
const port = 5000;

app.use(express.json());
const allowedOrigins = [
    'https://sky-hopper-flax.vercel.app/',
    'http://localhost:8080'
  ];
  
app.use(cors({
origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
    } else {
    callback(new Error('Not allowed by CORS'));
    }
},
credentials: true
}));
env.config();

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log("Mongo connection error --->", err));



app.use('/api/flights', flightRoutes);
app.use('/api', bookingRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chatbot', chatbotRoutes);


app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})

//vXsydD44gfdsinea
//yasersiddiquee



