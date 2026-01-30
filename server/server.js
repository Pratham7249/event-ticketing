require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://event-ticketing-1-b0or.onrender.com'],
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
