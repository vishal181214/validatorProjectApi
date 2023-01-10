import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cellnum: { type: String, required: true, unique: false},
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    Country: { type: String, required: true },
    State: { type: String, required: true },
    City: { type: String, required: true },
    desc: { type: String, required: true},
    img: { type: String, required: true},
    isAdmin: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  }
);

const userInfo = mongoose.model('userInfo', userSchema);
export default userInfo;