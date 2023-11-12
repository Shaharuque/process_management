import mongoose from "mongoose";
const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // type: {
  //   type: String,
  //   required: true,
  // },
  location: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  distance: {
    type: String,
    required: true,
  },
  // photos: {
  //   type: [String],
  // },
  description: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  accomodationPrice: {
    type: Number,
    required: true,
  },
  foodPrice: {
    type: Number,
    required: true,
  },
  serviceCharge: {
    type: Number,
    required: true,
  }
});

export default mongoose.model("Hotel", HotelSchema)