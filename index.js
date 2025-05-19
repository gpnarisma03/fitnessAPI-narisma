const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT;
const allowedOrigins = ['https://kk-fitness-app.vercel.app'];
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_STRING)
  .then(() => console.log('Now connected to MongoDB Atlas'))
  .catch(err => console.error('Failed to connect to MongoDB Atlas', err));

  app.use(express.json());


const workoutRoutes = require("./routes/workout");
const userRoutes = require("./routes/user");

app.use("/workouts", workoutRoutes);
app.use("/users", userRoutes);


if (require.main === module) {
    app.listen(port, () => console.log(`API is now online on port ${port}`));
 }
 
 module.exports = { app, mongoose };