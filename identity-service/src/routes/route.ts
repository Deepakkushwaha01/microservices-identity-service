import express from 'express'
import registerIdentity from '../controllers/identity/identity.register.controller'

const router = express.Router()

router.post('/register-identity', registerIdentity)

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' })
})

export default router
