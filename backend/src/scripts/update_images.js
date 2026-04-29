'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('../models/Property.model');

const IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200',
  'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
  'https://images.unsplash.com/photo-1513584684374-8bdb7489feef?w=1200',
  'https://images.unsplash.com/photo-1448630360428-654a10d93fc7?w=1200',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200',
  'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200',
  'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1200',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200'
];

async function update() {
  console.log('Connecting to DB...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected.');

  const properties = await Property.find();
  console.log(`Found ${properties.length} properties.`);

  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i];
    const mainImg = IMAGES[i % IMAGES.length];
    const secImg = IMAGES[(i + 1) % IMAGES.length];

    prop.images = [
      { url: mainImg, thumbnailUrl: mainImg.replace('w=1200', 'w=400'), isPrimary: true, order: 0 },
      { url: secImg, thumbnailUrl: secImg.replace('w=1200', 'w=400'), isPrimary: false, order: 1 }
    ];

    await prop.save();
  }

  console.log('Successfully updated all properties with varied images!');
  await mongoose.disconnect();
}

update().catch(console.error);
