import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken, sendTokenCookie } from '../utils/token.js';

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409);
    throw new Error('Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  const token = generateToken(user._id);
  sendTokenCookie(res, token);

  res.status(201).json({
    message: 'Account created successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});

export const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user._id);
  sendTokenCookie(res, token);

  res.status(200).json({
    message: 'Logged in successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

export const me = asyncHandler(async (req, res) => {
  res.status(200).json({ user: req.user });
});