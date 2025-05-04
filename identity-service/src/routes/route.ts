import express from 'express'
import registerIdentity from '../controllers/identity/identity.register.controller'

const router = express.Router()

router.post('/register-identity', registerIdentity)

// Example of errorhandler in middleware
// This is a sample route that throws an error to demonstrate the error handling middleware
router.get('/cause-error', (req, res, next) => {
  throw new Error('This is a sample error!')
})

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Identity service is up and running',
    timestamp: new Date().toISOString()
  })
})

export default router
