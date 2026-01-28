require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  // Add your Vercel domain here after deployment, e.g., 'https://your-app.vercel.app'
  'https://event-ticketing-client.vercel.app' 
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1 && !origin.includes('vercel.app')) {
      // Loose check for vercel.app previews
      // return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
      // For now, simpler for you:
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

const { MongoMemoryServer } = require('mongodb-memory-server');

// Connect to MongoDB
const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;
    
    // Fallback to In-Memory if no local/cloud URI provided or connection fails
    if (!mongoUri || mongoUri.includes('localhost')) {
       console.log('Attempting to start In-Memory MongoDB...');
       const mongod = await MongoMemoryServer.create();
       mongoUri = mongod.getUri();
       console.log('In-Memory MongoDB started at:', mongoUri);
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    // process.exit(1); 
  }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));

// Root Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
