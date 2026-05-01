const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://rvpatil0508_db_user:RealEstate2024!@cluster0.aniv2gf.mongodb.net/realestate?retryWrites=true&w=majority&appName=Cluster0';

async function fixAdmin() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to DB');

    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      role: String,
      name: String
    }));

    const user = await User.findOne({ email: 'rvpatil0508@gmail.com' });
    if (user) {
      console.log('Found user:', user.name, 'with role:', user.role);
      user.role = 'admin';
      await user.save();
      console.log('Successfully updated role to admin');
    } else {
      console.log('User not found');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixAdmin();
