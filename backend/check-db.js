'use strict';

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Models
const User = require('./src/models/User.model');
const Property = require('./src/models/Property.model');
const Lead = require('./src/models/Lead.model');
const OTP = require('./src/models/OTP.model');

dotenv.config();

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const userCount = await User.countDocuments();
    const propertyCount = await Property.countDocuments();
    const leadCount = await Lead.countDocuments();
    const otpCount = await OTP.countDocuments();

    const activeProperties = await Property.countDocuments({ status: 'active' });
    const featuredProperties = await Property.countDocuments({ isFeatured: true });

    console.log('\n--- Database Stats ---');
    console.log(`Total Users: ${userCount}`);
    console.log(`Total Properties: ${propertyCount}`);
    console.log(`  - Active: ${activeProperties}`);
    console.log(`  - Featured: ${featuredProperties}`);
    console.log(`Total Leads: ${leadCount}`);
    console.log(`Total OTPs: ${otpCount}`);
    console.log('----------------------\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkDatabase();
