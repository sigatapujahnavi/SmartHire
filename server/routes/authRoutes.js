// server/routes/authRoutes.js
import express from 'express'
import { signup, verifyOTP, login, logout, getMe,changePassword } from '../controllers/authController.js'
import { protectRoute } from '../middleware/protectRoute.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/verify-otp', verifyOTP)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', protectRoute, getMe)
router.post('/change-password', protectRoute, changePassword)
export default router