const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');
require('dotenv').config();

const Property = require('../src/models/Property.model');
const User = require('../src/models/User.model');

async function seedProperties() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    // 1. Get Admin User
    const adminEmail = 'pharshada962@gmail.com';
    const admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      console.error(`Admin user ${adminEmail} not found!`);
      process.exit(1);
    }

    // 2. Delete previous data
    console.log('Deleting existing properties for admin...');
    await Property.deleteMany({ createdBy: admin._id });

    // 3. Load New Data
    const rawData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../indian_real_estate_properties (1).json'), 'utf8'));
    const properties = rawData.properties;

    console.log(`Processing ${properties.length} properties...`);

    const typeMap = {
      'Residential': 'residential',
      'Commercial': 'commercial',
      'Agricultural': 'agricultural',
      'Plot': 'plot'
    };

    const subTypeMap = {
      'Apartment / Flat': 'apartment',
      'Independent House / Villa': 'villa',
      'Farmhouse': 'farmhouse',
      'Residential Plot': 'residential-plot',
      'Agricultural Land': 'agricultural-land',
      'Farm Land': 'agricultural-land',
      'Office Space': 'office-space',
      'Retail / Shop': 'retail-shop',
      'Retail Shop': 'retail-shop',
      'Commercial Complex / Mall': 'commercial-complex',
      'Hotel / Hospitality': 'hotel',
      'Industrial Land / Plot': 'industrial-plot'
    };

    const listingMap = {
      'For Sale': 'sale',
      'For Rent': 'rent',
      'For Lease': 'lease'
    };

    const furnishMap = {
      'Fully-Furnished': 'furnished',
      'Semi-Furnished': 'semi-furnished',
      'Unfurnished': 'unfurnished'
    };

    const imageMap = {
      apartment: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      villa: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      farmhouse: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      'office-space': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      'commercial-complex': 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800',
      'industrial-plot': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
      'residential-plot': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'
    };

    for (const p of properties) {
      const title = `${p.bedrooms ? p.bedrooms + 'BHK ' : ''}${p.sub_type} in ${p.locality}`;
      const slugBase = slugify(title, { lower: true, strict: true });
      const slug = `${slugBase}-${p.property_id.toLowerCase()}`;
      const subType = subTypeMap[p.sub_type] || 'apartment';

      const propData = {
        title,
        slug,
        description: `${p.sub_type} located at ${p.address}. ${p.amenities ? 'Amenities include: ' + p.amenities.join(', ') : ''}`,
        propertyType: typeMap[p.property_type] || 'residential',
        propertySubType: subType,
        listingType: listingMap[p.listing_status] || 'sale',
        price: p.price_inr || 0,
        carpetArea: p.carpet_area_sqft || 0,
        builtUpArea: p.plot_area_sqft || p.carpet_area_sqft || 0,
        areaUnit: 'sqft',
        bhkConfig: p.bedrooms ? (p.bedrooms > 4 ? '4+bhk' : p.bedrooms + 'bhk') : undefined,
        bathrooms: p.bathrooms || 0,
        floorNumber: p.floor_number || 0,
        totalFloors: p.total_floors || 1,
        status: 'active',
        furnishingStatus: furnishMap[p.furnishing_status] || 'unfurnished',
        possessionStatus: 'ready-to-move',
        location: {
          address: p.address,
          locality: p.locality,
          city: p.city,
          state: 'Maharashtra',
          pincode: p.address.match(/\d{6}/)?.[0] || '000000',
          coordinates: {
            type: 'Point',
            coordinates: [73.7898, 19.9975]
          }
        },
        images: [{ url: imageMap[subType] || imageMap.apartment, isPrimary: true, tag: 'exterior' }],
        createdBy: admin._id,
        isFeatured: Math.random() > 0.8
      };

      await Property.create(propData);
      console.log(`Inserted: ${title}`);
    }

    console.log(`Successfully inserted ${properties.length} properties!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedProperties();
