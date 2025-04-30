import mongoose from 'mongoose'

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
)

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// expiresAt: 1 – You’re creating an index on the expiresAt field.

// expireAfterSeconds: 0 – Tells MongoDB to delete the document immediately after expiresAt is reached.

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema)
export default RefreshToken
