// server/middleware/protectRoute.js
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, please login' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select('-password -otp -otpExpiry')
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}