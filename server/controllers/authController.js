// controllers/authController.js
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import User from '../models/User.js'
import { sendOTPEmail } from '../services/emailService.js'

// SIGNUP - Send OTP
export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    if (existingUser && !existingUser.isVerified) {
      existingUser.fullName = fullName
      existingUser.password = hashedPassword
      existingUser.otp = otp
      existingUser.otpExpiry = otpExpiry
      await existingUser.save()
    } else {
      await User.create({
        fullName,
        email,
        password: hashedPassword,
        otp,
        otpExpiry,
      })
    }

// Send email without blocking the response
sendOTPEmail(email, fullName, otp).catch(err => 
  console.error('Email send error:', err.message)
)
res.status(201).json({ message: 'OTP sent to your email!' })

  } catch (error) {
    console.error('SIGNUP ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

// VERIFY OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' })
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'OTP expired. Please signup again.' })
    }

    user.isVerified = true
    user.otp = undefined
    user.otpExpiry = undefined
    await user.save()

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

 res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
})

    res.status(200).json({
      message: 'Email verified successfully!',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    })

  } catch (error) {
    console.error('VERIFY ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

   res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
})

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    })

  } catch (error) {
    console.error('LOGIN ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

// LOGOUT
export const logout = async (req, res) => {
 res.clearCookie('token', {
  httpOnly: true,
  secure: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
})
  res.status(200).json({ message: 'Logged out successfully' })
}
export const getMe = async (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
    }
  })
}

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' })

    if (newPassword.length < 6)
      return res.status(400).json({ message: 'New password must be at least 6 characters' })

    user.password = await bcrypt.hash(newPassword, 12)
    await user.save()

    res.status(200).json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error('CHANGE PASSWORD ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}