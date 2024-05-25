import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req,res,next) => {
    // console.log(req.body);
    const {username,email,password} =req.body

    // Check if all required fields are provided and not empty
    if (!username || !email || !password || username ==='' || email==='' || password === '' ) {
        // If any field is missing, handle the error using errorHandler
        next(errorHandler(400,'All fields are required'))
    }

    // Hash the password using bcryptjs with a salt of 10
    const hashedPassword = bcryptjs.hashSync(password,10)
    // Create a new user instance with hashed password
    const newUser = new User({
        username,
        email,
        password:hashedPassword
    })

    try {
        // Attempt to save the new user to the database
        await newUser.save()
        // Respond with a success message if save is successful
        res.json('Signup successfull')
    } catch (error) {
        // Handle any errors during save operation
        next(error)
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
  
    // Check if email and password are provided and not empty
    if (!email || !password || email === '' || password === '') {
      // Handle error if any field is missing
      next(errorHandler(400, 'All fields are required'));
    }
  
    try {
      // Attempt to find the user by email
      const validUser = await User.findOne({ email });
      // If user is not found, handle the error
      if (!validUser) {
        return next(errorHandler(404, 'User not found'));
      }
      // Compare the provided password with the stored hashed password
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      // If password is invalid, handle the error
      if (!validPassword) {
        return next(errorHandler(400, 'Invalid password'));
      }
      // Generate a JWT token for the user
      const token = jwt.sign(
        { id: validUser._id, isAdmin: validUser.isAdmin },
        process.env.JWT_SECRET
      );
  
      // Exclude the password from the user details returned
      const { password: pass, ...rest } = validUser._doc;
  
      // Set a cookie with the token and return the user details
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    } catch (error) {
      // Handle any errors during the signin process
      next(error);
    }
  };

  export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
      // Attempt to find the user by email
      const user = await User.findOne({ email });
      if (user) {
        // If user exists, generate a JWT token
        const token = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.JWT_SECRET
        );
        // Exclude the password from the user details returned
        const { password, ...rest } = user._doc;
        // Set a cookie with the token and return the user details
        res
          .status(200)
          .cookie('access_token', token, {
            httpOnly: true,
          })
          .json(rest);
      } else {
        // If user does not exist, generate a random password
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        // Hash the generated password
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        // Create a new user with the generated username and hashed password
        const newUser = new User({
          username:
            name.toLowerCase().split(' ').join('') +
            Math.random().toString(9).slice(-4),
          email,
          password: hashedPassword,
          profilePicture: googlePhotoUrl,
        });
        // Attempt to save the new user to the database
        await newUser.save();
        // Generate a JWT token for the new user
        const token = jwt.sign(
          { id: newUser._id, isAdmin: newUser.isAdmin },
          process.env.JWT_SECRET
        );
        // Exclude the password from the user details returned
        const { password, ...rest } = newUser._doc;
        // Set a cookie with the token and return the user details
        res
          .status(200)
          .cookie('access_token', token, {
            httpOnly: true,
          })
          .json(rest);
      }
    } catch (error) {
      // Handle any errors during the Google signin process
      next(error);
    }
  };