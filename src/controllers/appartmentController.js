import Apartment from "../models/appartment.js";
import User from "../models/user.js"

export const createApartment = async (req,res) => {
    const {name, city, country, rooms, location} = req.body;
    try {
        const userId = req.user.id;
        const apartment = new Apartment({ name, city, country, rooms, location, user: userId });
        await apartment.save();
        res.status(201).json(apartment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const listApartment = async (req, res) => {
    try {
        const query = {}
        if(req.query.city){
            query.city = {$regex: req.query.city, $options: "i"}
        }
        if(req.query.country){
            query.country = {$regex: req.query.country, $options: "i"}
        }
        if(req.query.rooms){
            query.rooms = req.query.rooms
        }
        if(req.query.maxDistance){
            if(!req.query.latitude || !req.query.longitude){
                return res.status(400).json({message: 'Current latitude & logitude are mandatory'})
            }
            const radius = parseFloat(req.query.maxDistance) / 6378.1;
            query.location = { $geoWithin: { 
                $centerSphere: [ [ req.query.longitude, req.query.latitude ], radius ] }
            } 
        }
        
        const apartments = await Apartment.find(query).populate({ path: 'user', select: '-password'});
        if(req.query.maxDistance) {
            const apartmentsWithDistance = apartments.map(apartment => {
                const longitude = apartment.location.coordinates[0];
                const latitude = apartment.location.coordinates[1];
                const distance = calculateDistance(req.query.latitude, req.query.longitude, latitude, longitude)
                return {
                    ...apartment.toObject(), // Convert Mongoose document to plain object
                    distance: Number(distance.toFixed(2)) // Round to 2 decimal places
                  };
            })
            res.status(200).json(apartmentsWithDistance);
        } else{
            res.status(200).json(apartments);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const favouriteApartment = async(req,res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        if (!(user instanceof User)) {
            return res.status(500).json({ message: 'User not found or not a valid instance' });
          }
        const apartmentId = req.params.apartmentId;
        const apartmentExists = await Apartment.findById(apartmentId)
        if(!apartmentExists) return res.status(400).send({message: "Apartment does not exists."});
        if (!Array.isArray(user.favourite)) {
            user.favourite = [];
          }
        if(!user.favourite.includes(apartmentId)){
            user.favourite.push(apartmentId);
            await user.save();
        }
        res.status(200).json({ message: 'Apartment favourited successfully'});
        
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const R = 6371; // Radius of the Earth in km
  
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
  
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
  
    return distance;
  };