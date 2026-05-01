const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});
const User = require('../src/models/User.model');

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const user = await User.findOne({ email: 'pharshada962@gmail.com' }).select('+passwordHash +refreshToken');
    if (user) {
      console.log('User found:', {
        id: user._id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        hasPassword: !!user.passwordHash,
        hasRefreshToken: !!user.refreshToken
      });
    } else {
      console.log('User not found');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
check();
