import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async(req, res) => {
  const {name, email, password} = req.body;
  try {

    const userExists = await User.findOne({ email: email });
    console.log(userExists)

    if(userExists) return res.status(400).json({message:"User already exists"});

    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password,salt);

    //creat user
    const user = new User({name, email,  password: hashedPwd});
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'sample-secret', {
      expiresIn: '1h',
    });
    res.status(200).json({message: "User created successfully", token});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const authUser = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email:email});
    if(!user) return res.status(400).json({message: "User doesn't exists with the given email"});
  
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) return res.status(400).json({message: "Invalid Password. Please try again."});

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.status(200).json({message: "User authentication successfull", token});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const listFavourites = async(req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favourite');
    res.status(200).send({data: user.favourite})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}