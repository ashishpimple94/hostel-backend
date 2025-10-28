const mongoose = require('mongoose');
const Room = require('./models/Room');
require('dotenv').config();

const updateRoomPricing = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    const rooms = await Room.find({});
    console.log(`Found ${rooms.length} rooms to update`);

    let updatedCount = 0;

    for (const room of rooms) {
      let rent, rentFor5Months;

      if (room.isAC) {
        // AC Rooms - only 2 sharing available
        if (room.type === 'double') {
          rent = 21000;
          rentFor5Months = 105000;
        } else {
          // Skip other types for AC or keep existing values
          continue;
        }
      } else {
        // Non-AC Rooms
        switch (room.type) {
          case 'quadruple': // 4 Sharing
            rent = 12000;
            rentFor5Months = 60000;
            break;
          case 'double': // 2 Sharing
            rent = 17000;
            rentFor5Months = 85000;
            break;
          case 'single': // 1 Sharing
            rent = 22000;
            rentFor5Months = 110000;
            break;
          case 'triple': // 3 Sharing (if exists)
            rent = 15000;
            rentFor5Months = 75000;
            break;
          default:
            continue;
        }
      }

      // Update the room
      room.rent = rent;
      room.rentFor5Months = rentFor5Months;
      room.messChargePerMonth = 3000;
      room.messChargeFor5Months = 15000;
      room.isMessCompulsory = true;

      await room.save();
      updatedCount++;

      console.log(`Updated Room ${room.roomNo}: ${room.type} ${room.isAC ? 'AC' : 'Non-AC'} - ₹${rent}/month, ₹${rentFor5Months}/5 months`);
    }

    console.log(`\n✅ Successfully updated ${updatedCount} rooms!`);
    console.log('\nPricing Summary:');
    console.log('Non-AC Rooms:');
    console.log('  - 4 Sharing: ₹12,000/month × 5 = ₹60,000 + Mess ₹15,000 = ₹75,000');
    console.log('  - 2 Sharing: ₹17,000/month × 5 = ₹85,000 + Mess ₹15,000 = ₹1,00,000');
    console.log('  - 1 Sharing: ₹22,000/month × 5 = ₹1,10,000 + Mess ₹15,000 = ₹1,25,000');
    console.log('\nAC Rooms:');
    console.log('  - 2 Sharing: ₹21,000/month × 5 = ₹1,05,000 + Mess ₹15,000 = ₹1,20,000');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating room pricing:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

updateRoomPricing();
