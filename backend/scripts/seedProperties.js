const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Property = require('../src/models/property.model');
const User = require('../src/models/user.model');

const ADMIN_ID = '69f21bb528fe66366108c0bb';

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000',
  'https://images.unsplash.com/photo-1600607687940-4e524cb35797?q=80&w=1000',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1000'
];

async function seedData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const jsonPath = path.join(__dirname, '../../indian_real_estate_data.json');
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(rawData);

    const propertiesToInsert = data.properties.map((p, index) => {
      // Map property type
      let pType = 'residential';
      if (p.property_type.toLowerCase().includes('office') || p.property_type.toLowerCase().includes('shop') || p.property_type.toLowerCase().includes('commercial')) {
        pType = 'commercial';
      } else if (p.property_type.toLowerCase().includes('plot') || p.property_type.toLowerCase().includes('land')) {
        pType = 'plot';
      }

      // Map sub type
      let subType = 'apartment';
      if (p.property_type.toLowerCase().includes('villa')) subType = 'villa';
      if (p.property_type.toLowerCase().includes('plot')) subType = 'residential-plot';
      if (p.bedrooms === 1) subType = '1bhk';
      if (p.bedrooms === 2) subType = '2bhk';
      if (p.bedrooms === 3) subType = '3bhk';

      return {
        title: p.title,
        description: p.description || `${p.bedrooms} BHK ${p.property_type} in ${p.locality}, ${p.city}. ${p.area_sqft} sqft area.`,
        propertyType: pType,
        propertySubType: subType,
        listingType: p.listing_type.toLowerCase(),
        price: p.price,
        pricePerSqft: p.price_per_sqft,
        builtUpArea: p.area_sqft,
        carpetArea: p.carpet_area_sqft || (p.area_sqft * 0.8),
        areaUnit: 'sqft',
        bhkConfig: p.bedrooms ? (p.bedrooms > 4 ? '4+bhk' : `${p.bedrooms}bhk`) : undefined,
        bathrooms: p.bathrooms,
        balconies: p.balconies,
        floorNumber: p.floor_number,
        totalFloors: p.total_floors,
        facing: p.facing?.toLowerCase(),
        furnishingStatus: p.furnishing_status?.toLowerCase().includes('fully') ? 'furnished' : 
                          p.furnishing_status?.toLowerCase().includes('semi') ? 'semi-furnished' : 'unfurnished',
        possessionStatus: p.possession_status?.toLowerCase().includes('ready') ? 'ready-to-move' : 
                          p.possession_status?.toLowerCase().includes('under') ? 'under-construction' : 'new-launch',
        reraNumber: p.rera_number,
        reraApproved: !!p.rera_registered,
        location: {
          address: `${p.locality}, ${p.city}, ${p.state}`,
          locality: p.locality,
          city: p.city,
          state: p.state,
          pincode: p.pincode,
          coordinates: {
            type: 'Point',
            coordinates: [p.longitude, p.latitude]
          }
        },
        images: [
          { url: DEFAULT_IMAGES[index % DEFAULT_IMAGES.length], isPrimary: true, tag: 'exterior' }
        ],
        societyAmenities: (p.amenities || []).map(a => a.toLowerCase().replace(/ /g, '-')).filter(a => [
          'gym', 'swimming-pool', 'clubhouse', '24hr-security', 'power-backup',
          'lift', 'cctv', 'intercom', 'visitor-parking', 'garden', 'playground'
        ].includes(a)),
        status: 'active',
        createdBy: ADMIN_ID
      };
    });

    console.log(`Deleting existing properties for admin...`);
    await Property.deleteMany({ createdBy: ADMIN_ID });

    console.log(`Inserting ${propertiesToInsert.length} properties...`);
    for (const propData of propertiesToInsert) {
      const prop = new Property(propData);
      await prop.save();
      console.log(`Inserted: ${prop.title}`);
    }
    console.log(`Successfully inserted all properties!`);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seedData();
