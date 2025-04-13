const express = require('express');
const upload = require('../middleware/upload');
const mongoose = require('mongoose');
const fs = require('fs');
  const path = require('path');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const { Food, validate } = require('../models/food');

router.get('/', async (req, res) => {
  const foods = await Food.find().sort('name');
  res.send(foods);
});

router.post('/',[auth, admin, upload.single('photo')], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const filename = req.file ? req.file.filename : null;
  const photoUrl = filename
    ? `${req.protocol}://${req.get('host')}/uploads/${filename}`
    : null;

  let food = new Food({
    name: req.body.name,
    price: req.body.price,
    combination: req.body.combination,
    photo: filename ? { filename, url: photoUrl } : null
  });

  food = await food.save();
  res.send(food);
});
router.put('/:id', [auth, admin, upload.single('photo')], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const food = await Food.findById(req.params.id);
  if (!food) return res.status(404).send('Food item not found');

// Delete old image file if new one is uploaded
if (req.file && food.photo && food.photo.filename) {
  const oldPath = path.join(__dirname, '..', 'uploads', food.photo.filename);
  if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
}

// Update fields
food.name = req.body.name;
food.price = req.body.price;
food.combination = req.body.combination;

if (req.file) {
  const filename = req.file.filename;
  const photoUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
  food.photo = { filename, url: photoUrl };
}

await food.save();
res.send(food);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const food = await Food.findByIdAndDelete(req.params.id);
  if (!food) return res.status(404).send('Food item not found');

  // Delete image file if exists
  if (food.photo) {
    const fs = require('fs');
    const imagePath = path.join(__dirname, '..', 'uploads', food.photo);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
  }
  res.send(food);
});

router.get('/:id', async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) return res.status(404).send('Food item not found');
  res.send(food);
});

module.exports = router;

// router.put('/:id', [auth, admin], async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const food = await Food.findByIdAndUpdate(
//     req.params.id,
//     {
//       name: req.body.name,
//       price: req.body.price,
//       combination: req.body.combination
//     },
//     { new: true }
//   );

//   if (!food) return res.status(404).send('Food item not found');
//   res.send(food);
// });

