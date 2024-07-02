import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const auth = async (req,res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1];
            const decodedValue = jwt.verify(token,process.env.JWT_SECRET)
            const user = await User.findById(decodedValue.id).select('-password');
            if(!user)  return res.status(401).json({ message: 'Not authorized, Invalid token' });
            req.user = user
            next()
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, Invalid token' });
        }
    } else {
        return res.status(401).json({message:"Not authorized. Token is required"})
    }
}
