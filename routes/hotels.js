import express from "express";
import {
  createHotel,
  filterHotels,
  findHotelByName,
  getHotel,
  getHotels,
  getNearbyHotels,
} from "../controllers/hotel.js";
const router = express.Router();

//1,2.CREATE hotel
router.post("/", createHotel);

//GET ONE Hotel
router.get("/find/:id", getHotel);

//3.GET ALL Hotels
router.get("/", getHotels);

// 4. SEARCH hotels by name/description
router.get("/search/:name", findHotelByName)

// 5. FILTER by hotel based on location,price and rating
router.get("/filter", filterHotels)

//7. get nearest hotels by location and distance
router.get("/nearest", getNearbyHotels)

export default router;
