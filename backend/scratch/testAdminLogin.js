const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({path: path.join(__dirname, '../.env')});
const User = require('../src/models/User.model');

async function testLogin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const email = 'pharshada962@gmail.com';
    const password = 'harsh@123';
    
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      console.log('User not found');
      process.exit(0);
    }
    
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    console.log(`Login test for ${email}: ${isMatch ? 'SUCCESS' : 'FAILED'}`);
    
    if (!isMatch) {
      console.log('Resetting password to match .env...');
      const salt = await bcrypt.genSalt(12);
      user.passwordHash = await bcrypt.hash(password, salt);
      await user.save();
      console.log('Password reset successful');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
testLogin();
