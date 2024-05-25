import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';
import Token from '../models/tokenModel.js'
import crypto from 'crypto'
import {sendEmail} from '../utils/sendEmail.js';
import nodemailer from 'nodemailer';

// Test endpoint to check if API is working
export const test = (req,res) => {
    res.json({message: 'API is working'})
}

// Update user details
export const updateUser = async (req, res, next) => {
    // Check if the user is authorized to update the user details
    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to update this user'));
    }
    // Validate and hash new password
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(errorHandler(400, 'Password must be at least 6 characters'));
      }
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    // Validate username constraints
    if (req.body.username) {
      if (req.body.username.length < 7 || req.body.username.length > 20) {
        return next(
          errorHandler(400, 'Username must be between 7 and 20 characters')
        );
      }
      if (req.body.username.includes(' ')) {
        return next(errorHandler(400, 'Username cannot contain spaces'));
      }
      if (req.body.username !== req.body.username.toLowerCase()) {
        return next(errorHandler(400, 'Username must be lowercase'));
      }
      if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
        return next(
          errorHandler(400, 'Username can only contain letters and numbers')
        );
      }
    }
    // Attempt to update user in database
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            profilePicture: req.body.profilePicture,
            password: req.body.password,
          },
        },
        { new: true }
      );
      const { password, ...rest } = updatedUser._doc;
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
};

// Delete a user
export const deleteUser = async (req, res, next) => {
    // Check if the user is authorized to delete the user
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to delete this user'));
    }
    // Attempt to delete user from database
    try {
      await User.findByIdAndDelete(req.params.userId);
      res.status(200).json('User has been deleted');
    } catch (error) {
      next(error);
    }
};

// Sign out a user
export const signout = (req, res, next) => {
    // Attempt to clear user session and sign out
    try {
      res
        .clearCookie('access_token')
        .status(200)
        .json('User has been signed out');
    } catch (error) {
      next(error);
    }
};

// Get all users with pagination and sorting
export const getUsers = async (req, res, next) => {
  // Check if the user is authorized to view all users
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }
  // Retrieve users from database with pagination and sorting
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single user by ID
export const getUser = async (req, res, next) => {
  // Retrieve a single user from database
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Handle forgot password request
export const forgotPassword = async (req, res,next) => {
  // Process forgot password request
  const { email } = req.body;
  const user = await User.findOne({ email }); // check the email if in the user

  // Check if user exists
  if (!user) {
  res.status(404);
  throw new Error("User does not exist");
  }

  // Delete existing token if it exists
  let token = await Token.findOne({ userId: user._id });
  if (token) {
  await token.deleteOne();
  }
  console.log(token);

  // Create reset token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(resetToken);
  // res.send("Forgot password")

  // Hash token before saving to DB
  const hashedToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");
  // console.log(hashedToken);

  // Save Token to DB
  await new Token({
  userId: user._id,
  token: hashedToken,
  createdAt: Date.now(),
  expiresAt: Date.now() + 30 * (60 * 1000), // Thirty minutes
  }).save();

  // Construct Reset Url
  const resetUrl = `http://localhost:5173/resetpassword/${resetToken}`;

  // Construct reset email
  const message = `
      <h2>Hello</h2>
      <p>Please use the url below to reset your password</p>  
      <p>This reset link is valid for only 30minutes.</p>

      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

      <p>Regards...</p>
      <p>BabyCode Team</p>
  `;
  const subject = "Password Reset Request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  // Send reset email
  try {
      await sendEmail(subject, message, send_to, sent_from);
      res.status(200).json({ success: true, message: "Reset Email Sent" });
  } catch (error) {
      res.status(500);
      throw new Error("Email not sent, please try again");
  }
};

// Handle password reset
export const resetPassword = async (req, res, next) => {
  // Process password reset request
  const { password } = req.body;
  const { resetToken } = req.params;

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    return res.status(404).json({ message: "Invalid or Expired Token" });
  }

  const user = await User.findOne({ _id: userToken.userId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.password = password;
  if (user.password) {
    if (user.password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }
    user.password = bcryptjs.hashSync(req.body.password, 10);
  }
  await user.save();

  res.status(200).json({
    message: "Password Reset Successful, Please Login",
  });
};
