const mongoose = require('mongoose');
const Room = require('./models/Room');
require('dotenv').config();

const updateRoomsPricing = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get all rooms
    const rooms = await Room.find({});
    console.log(`📦 Found ${rooms.length} rooms to update`);

    for (const room of rooms) {
      // Set pricing based on room type and features
      let rentFor5Months;
      let monthlyRent;

      // Check if it's 2 sharing AC
      if (room.type === 'double' && room.isAC) {
        monthlyRent = 4200;
        rentFor5Months = 21000;
      }
      // Check if it's 2 sharing bunk
      else if (room.type === 'double' && room.isBunk) {
        monthlyRent = 2900;
        rentFor5Months = 14500;
      }
      // Regular pricing based on type
      else {
        switch (room.type) {
          case 'single':
            monthlyRent = 4400;
            rentFor5Months = 22000;
            break;
          case 'double':
            monthlyRent = 3400;
            rentFor5Months = 17000;
            break;
          case 'triple':
            monthlyRent = 3000;
            rentFor5Months = 15000;
            break;
          case 'quadruple':
            monthlyRent = 2400;
            rentFor5Months = 12000;
            break;
          default:
            monthlyRent = room.rent;
            rentFor5Months = room.rent * 5;
        }
      }

      // Update room
      room.rent = monthlyRent;
      room.rentFor5Months = rentFor5Months;
      room.extraCharge1to2Months = 2000;
      room.extraCharge3to4Months = 1000;

      await room.save();
      console.log(`✅ Updated room ${room.roomNo}: ₹${monthlyRent}/month, ₹${rentFor5Months} for 5 months`);
    }

    console.log('\n🎉 All rooms updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating rooms:', error);
    process.exit(1);
  }
};

updateRoomsPricing();
