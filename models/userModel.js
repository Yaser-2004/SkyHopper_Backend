import mongoose from 'mongoose';  

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    wallet: { type: Number, default: 50000 },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }]
  });


const UserModel = mongoose.model('User', userSchema);
export default UserModel;