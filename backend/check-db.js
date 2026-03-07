const mongoose = require('mongoose');
require('dotenv').config();

const Donation = require('./src/models/Donation');
const NGO = require('./src/models/NGO');

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB!");
  
  const donations = await Donation.find();
  console.log("DONATIONS:", donations);
  
  const ngos = await NGO.find();
  console.log("NGOS:", ngos);
  
  process.exit();
}

check();
