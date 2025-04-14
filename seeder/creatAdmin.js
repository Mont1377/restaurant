const _ = require('lodash');
const config = require('config');
const asyncMiddleware = require('../middleware/async');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');

async function createAdmin() {
  try {
    await mongoose.connect('mongodb://localhost:27017/restu');

    const existingAdmin = await User.findOne({ email: 'mohsen.mmt1390@gmail.com' });
    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('mohsen1377!', salt);

    const admin = new User({
      name: 'Mohsen Tavassoli',
      email: 'mohsen.mmt1390@gmail.com',
      password: hashed,
      address: 'Malekian22, Allahoakbar St, Esfahan, Iran',
      phone: '09162308986',
      isAdmin: true,
      orders: []
    });

    await admin.save();
    console.log('Admin created successfully with ID:', admin._id);
  } catch (err) {
    console.error('Error creating admin:', err);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();

// ya ina bezar tooye users routes

// const mongoose = require('mongoose');
// const auth = require('./middleware/auth');
// const asyncMiddleware = require('./middleware/async');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const config = require('config');
// const _ = require('lodash');
// const { User } = require('./models/user');
// const express = require('express');
// const router = express.Router();
//for creat admin
// router.post('/create-admin', async (req, res) => {
//     const existingAdmin = await User.findOne({ email: 'mohsen.mmt1390@gmail.com' });
//     if (existingAdmin) return res.status(400).send('Admin already exists');
  
//   const salt = await bcrypt.genSalt(10);
//   const hashed = await bcrypt.hash('mohsen1377!', salt);

//   const result = await User.collection.insertOne({
//         name: 'Mohsen tavassoli',
//         email: 'mohsen.mmt1390@gmail.com',
//         password: hashed,
//         address: 'malekian22, allahoakbar st,esfahan,iran',
//         phone: '09162308986',
//         isAdmin: true,
//         orders: []
//     });
//     await result.save();
//     const token = result.generateAuthToken();
//     res.header('x-auth-token', token).send(_.pick(result, ['_id', 'name' , 'email', 'address']));
//     res.send(' Admin created successfully');
// });
//module.exports = router;