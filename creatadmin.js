const mongoose = require('mongoose');
const auth = require('./middleware/auth');
const asyncMiddleware = require('./middleware/async');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');
const _ = require('lodash');
const { User } = require('./models/user');
const express = require('express');
const router = express.Router();

async function createAdmin() {
  await mongoose.connect('mongodb://localhost/your-db-name'); // Replace with your DB

  const existingAdmin = await User.findOne({ email: 'admin@example.com' });
  if (existingAdmin) {
    console.log('Admin already exists');
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash('mohsen1377!', salt);

  const result = await User.collection.insertOne({
    name: 'Mohsen tavassoli',
    email: 'mohsen.mmt1390@gmail.com',
    password: hashed,
    address: 'malekian22, allahoakbar st,esfahan,iran',
    phone: '09162308986',
    isAdmin: true,
    orders: []
  });

  console.log('Admin inserted:', result.insertedId);
  await result.save();
  const token = result.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(result, ['_id', 'name' , 'email', 'address']));
  res.send(' Admin created successfully');
  mongoose.disconnect();
}

createAdmin();
