const isEdgeRuntime = typeof (globalThis as { EdgeRuntime?: unknown }).EdgeRuntime !== 'undefined'

let isConnected = false

const connectDB = async () => {
  if (isEdgeRuntime) {
    return true
  }

  const mongoose = await import('mongoose')
  
  if (isConnected && mongoose.default.connection?.readyState === 1) {
    return true
  }

  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI not found in environment variables")
    return false
  }

  try {
    await mongoose.default.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    })
    isConnected = true
    
    mongoose.default.connection.on('connected', () => {
      isConnected = true
      console.log('MongoDB connected successfully')
    })

    mongoose.default.connection.on('disconnected', () => {
      isConnected = false
      console.log('MongoDB disconnected')
    })

    mongoose.default.connection.on('error', (error) => {
      isConnected = false
      console.error('MongoDB connection error:', error)
    })

    return true
  } catch (error) {
    console.error("MongoDB connection error:", error)
    isConnected = false
    return false
  }
}

export default connectDB
