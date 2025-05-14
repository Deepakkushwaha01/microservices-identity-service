import express from 'express'
import registerIdentity from '../controllers/identity/identity.register.controller'
import authMiddleware from '../middlewares/authMiddleware'
import loginIdentity from '../controllers/identity/identity.login.controller'

const router = express.Router()

// Register route without auth middleware
router.post('/register-identity', registerIdentity)
router.post('/login-identity', loginIdentity)


// Apply auth middleware to everything below
router.use(authMiddleware)

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
