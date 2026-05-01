const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});
const User = require('../src/models/User.model');

async function dump() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: 'pharshada962@gmail.com' });
    console.log(JSON.stringify(user, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
dump();
