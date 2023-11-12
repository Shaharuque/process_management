import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);

  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    next(err);
  }
};
export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};
export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};
export const getHotels = async (req, res, next) => {
  const { min, max, ...others } = req.query;
  try {
    const hotels = await Hotel.find({
      ...others,
      cheapestPrice: { $gt: min | 1, $lt: max || 999 },
    }).limit(req.query.limit);
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};
export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((c) => {
        return Hotel.countDocuments({ city: c });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};
export const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resorts", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

//4. find hotel by name or description
export const findHotelByName = async (req, res, next) => {
  try {
    const searchTerm = req.params.name; // Assuming you have a single parameter for both name and description

    const hotels = await Hotel.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } }, // Case-insensitive name search
        { description: { $regex: searchTerm, $options: "i" } }, // Case-insensitive description search
      ],
    });
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};

//5. filter hotels by location, price and rating
export const filterHotels = async (req, res, next) => {
  try {
    const { location, priceRange, reviewRating } = req.query;
    // const location = req.params.location;
    
    const filters = {};
    
    if (location) {
      filters.location = { $regex: location, $options: 'i' }; // Case-insensitive location search
    }
    
    if (priceRange) {
      // Assuming priceRange is provided as a string like "0-100" or "100-200"
      const [minPrice, maxPrice] = priceRange.split('-');
      filters.accomodationPrice = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    }
    
    if (reviewRating) {
      filters.rating = { $gte: parseInt(reviewRating) };
    }

    const hotels = await Hotel.find(filters);

    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
}

//7. nearest hotels by location and distance
export const getNearbyHotels = async (req, res, next) => {
  try {
    const { location, distance } = req.query;

    const hotels = await Hotel.find({
      location: { $regex: location, $options: 'i' },
      distance: { $lte: parseInt(distance) },
    });

    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
}
