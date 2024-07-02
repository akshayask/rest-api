import express from 'express';
const router = express.Router();
import { createApartment, listApartment, favouriteApartment } from '../controllers/appartmentController.js'
import { auth } from '../middlewares/authmiddleware.js'

router.post('/create', auth, createApartment);
router.get('/list', listApartment);
router.get('/favourites/:apartmentId', auth, favouriteApartment);

export default router;