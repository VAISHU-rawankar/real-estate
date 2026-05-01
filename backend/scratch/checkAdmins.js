const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});
const User = require('../src/models/User.model');

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const admins = await User.find({ role: 'admin' });
    console.log('Admins found:', admins.map(u => ({
      email: u.email,
      role: u.role,
      isActive: u.isActive
    })));
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
check();
