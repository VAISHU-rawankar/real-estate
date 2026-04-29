'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const Property = require('../models/Property.model');
const Lead = require('../models/Lead.model');
const BlogPost = require('../models/BlogPost.model');
const ChannelPartner = require('../models/ChannelPartner.model');

const CITIES = ['Mumbai', 'Pune', 'Bangalore', 'Hyderabad', 'Delhi', 'Chennai', 'Nashik'];
const LOCALITIES = {
  Mumbai: ['Bandra', 'Andheri', 'Powai', 'Worli', 'Juhu'],
  Pune: ['Koregaon Park', 'Wakad', 'Hinjewadi', 'Kothrud', 'Baner'],
  Bangalore: ['Whitefield', 'Koramangala', 'Indiranagar', 'HSR Layout', 'Electronic City'],
  Hyderabad: ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Hitec City', 'Kondapur'],
  Delhi: ['Vasant Kunj', 'Dwarka', 'Rohini', 'Janakpuri', 'Saket'],
  Chennai: ['Adyar', 'Velachery', 'Anna Nagar', 'OMR', 'Porur'],
  Nashik: ['Gangapur Road', 'Tidke Colony', 'Nashik Road', 'Satpur', 'Ambad'],
};

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomPrice(min, max) { return Math.floor(Math.random() * (max - min) + min) * 100000; }

async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}), Property.deleteMany({}),
    Lead.deleteMany({}), BlogPost.deleteMany({}), ChannelPartner.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data');

  // Create admin
  const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 12);
  const admin = await User.create({
    name: process.env.ADMIN_NAME || 'Admin',
    email: process.env.ADMIN_EMAIL || 'admin@realestate.com',
    passwordHash: adminHash,
    role: 'admin',
    isEmailVerified: true,
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Create regular users
  const userHash = await bcrypt.hash('User@1234', 12);
  const users = await User.insertMany([
    { name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '9876543210', passwordHash: userHash, isEmailVerified: true, isPhoneVerified: true },
    { name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543211', passwordHash: userHash, isEmailVerified: true },
    { name: 'Amit Patel', email: 'amit@example.com', phone: '9876543212', passwordHash: userHash, isEmailVerified: true },
    { name: 'Sneha Desai', email: 'sneha@example.com', phone: '9876543213', passwordHash: userHash, isEmailVerified: true },
    { name: 'Vikram Mehta', email: 'vikram@example.com', phone: '9876543214', passwordHash: userHash, isEmailVerified: true },
  ]);
  console.log('✅ 5 users created');

  // Create properties
  const properties = [];
  const configs = ['2bhk', '3bhk', '1bhk', '4bhk', 'studio'];
  const statuses = ['active', 'active', 'active', 'featured', 'active', 'draft', 'sold'];

  for (let i = 1; i <= 50; i++) {
    const city = randomItem(CITIES);
    const localities = LOCALITIES[city];
    const locality = randomItem(localities);
    const isResidential = i <= 30;
    const propType = isResidential ? 'residential' : (i <= 40 ? 'commercial' : (i <= 45 ? 'plot' : 'agricultural'));
    const subTypes = {
      residential: ['apartment', 'villa', 'independent-house', 'builder-floor'],
      commercial: ['office-space', 'retail-shop', 'warehouse'],
      plot: ['residential-plot', 'commercial-plot'],
      agricultural: ['agricultural-land', 'farmhouse'],
    };

    properties.push({
      title: `${randomItem(configs).toUpperCase()} ${randomItem(['Apartment', 'Villa', 'Flat', 'Home'])} in ${locality}`,
      propertyType: propType,
      propertySubType: randomItem(subTypes[propType]),
      listingType: randomItem(['sale', 'rent', 'lease']),
      price: randomPrice(15, propType === 'residential' ? 500 : 200),
      bhkConfig: isResidential ? randomItem(configs) : undefined,
      carpetArea: Math.floor(Math.random() * 2000) + 500,
      builtUpArea: Math.floor(Math.random() * 2500) + 600,
      bathrooms: Math.floor(Math.random() * 4) + 1,
      balconies: Math.floor(Math.random() * 3),
      floorNumber: Math.floor(Math.random() * 20),
      totalFloors: Math.floor(Math.random() * 25) + 5,
      facing: randomItem(['east', 'west', 'north', 'south']),
      furnishingStatus: randomItem(['furnished', 'semi-furnished', 'unfurnished']),
      possessionStatus: randomItem(['ready-to-move', 'under-construction', 'new-launch']),
      parking: randomItem(['covered', 'open', 'both', 'none']),
      reraApproved: Math.random() > 0.5,
      reraNumber: Math.random() > 0.5 ? `RERA${Math.random().toString(36).substring(2, 10).toUpperCase()}` : undefined,
      status: randomItem(statuses),
      isFeatured: i <= 8,
      location: {
        address: `${Math.floor(Math.random() * 999) + 1}, ${locality} Main Road`,
        locality,
        city,
        state: 'Maharashtra',
        pincode: `4${Math.floor(Math.random() * 90000 + 10000)}`,
        coordinates: {
          type: 'Point',
          coordinates: [72.8 + Math.random() * 2, 19.0 + Math.random() * 2],
        },
      },
      societyAmenities: ['gym', 'swimming-pool', 'lift', '24hr-security', 'power-backup'].slice(0, Math.floor(Math.random() * 5) + 1),
      images: [
        { url: `https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200`, thumbnailUrl: `https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400`, isPrimary: true, order: 0 },
        { url: `https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=1200`, thumbnailUrl: `https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=400`, isPrimary: false, order: 1 },
      ],
      description: `Beautiful ${isResidential ? 'residential' : 'commercial'} property located in the heart of ${locality}, ${city}. This well-maintained property offers excellent connectivity, modern amenities, and a prime location. Perfect for families looking for a comfortable home or investors seeking premium real estate.`,
      createdBy: admin._id,
      viewCount: Math.floor(Math.random() * 500),
      enquiryCount: Math.floor(Math.random() * 20),
    });
  }

  for (const propertyData of properties) {
    await Property.create(propertyData);
  }
  console.log('✅ 50 properties created');

  // Create leads
  const createdProperties = await Property.find().select('_id').lean();
  const leads = [];
  for (let i = 0; i < 30; i++) {
    leads.push({
      name: `Lead Person ${i + 1}`,
      phone: `98765${String(i).padStart(5, '0')}`,
      email: `lead${i + 1}@example.com`,
      message: 'I am interested in this property. Please contact me.',
      property: randomItem(createdProperties)._id,
      source: randomItem(['enquiry-form', 'whatsapp', 'call', 'homepage-form']),
      status: randomItem(['new', 'contacted', 'interested', 'closed']),
    });
  }
  await Lead.insertMany(leads);
  console.log('✅ 30 leads created');

  // Create blog posts
  const blogPosts = [
    { title: 'Top 10 Real Estate Investment Tips for 2025', content: 'Real estate investment remains one of the most reliable wealth-building strategies...', status: 'published', author: admin._id, tags: ['investment', 'tips'], excerpt: 'Discover the best strategies for real estate investment in 2025.' },
    { title: 'RERA: Everything You Need to Know', content: 'The Real Estate Regulatory Authority (RERA) has transformed the Indian real estate sector...', status: 'published', author: admin._id, tags: ['rera', 'legal'], excerpt: 'Complete guide to RERA compliance and buyer rights.' },
    { title: 'Home Loan Guide: Getting the Best Rate', content: 'Securing a home loan at the best interest rate requires careful planning...', status: 'published', author: admin._id, tags: ['home-loan', 'finance'], excerpt: 'How to secure the best home loan rates in India.' },
    { title: 'Nashik Real Estate: Emerging Investment Hub', content: 'Nashik has emerged as one of the fastest-growing real estate markets in Maharashtra...', status: 'published', author: admin._id, tags: ['nashik', 'investment'], excerpt: 'Why Nashik is becoming a top real estate investment destination.' },
    { title: 'Commercial Real Estate Trends 2025', content: 'The commercial real estate sector is witnessing transformative changes...', status: 'draft', author: admin._id, tags: ['commercial', 'trends'] },
  ];

  for (const post of blogPosts) {
    await BlogPost.create(post);
  }
  console.log('✅ Blog posts created');

  console.log('\n🎉 Database seeded successfully!');
  console.log(`📧 Admin: ${admin.email} / Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
