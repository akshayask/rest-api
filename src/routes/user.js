import express from 'express';
const router = express.Router();
import { authUser, registerUser, listFavourites } from '../controllers/userController.js'
import {auth} from '../middlewares/authmiddleware.js'

router.post('/signUp', registerUser);
router.post('/signIn', authUser);
router.get('/favourites', auth, listFavourites);

export default router;
