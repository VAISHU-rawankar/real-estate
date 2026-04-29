const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});
const Property = require('../src/models/Property.model');

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const all = await Property.find().select('title createdBy').lean();
  console.log('All:', JSON.stringify(all, null, 2));
  process.exit(0);
}
check();
