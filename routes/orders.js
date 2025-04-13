const auth = require('../middleware/auth');
const express = require('express');
const mongoose = require('mongoose');
const { Order, validate } = require('../models/order');
const admin = require("../middleware/admin");
const { User } = require('../models/user');
const { Food } = require('../models/food');

const router = express.Router();

// GET all orders
router.get('/', auth, async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email phone address')
    .populate('foods.foodId', 'name price');

  res.send(orders);
});

// GET order by ID
router.get('/:id', auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send('Invalid order ID.');

  const order = await Order.findById(req.params.id)
    .populate('user', 'name email address phone')
    .populate('foods.foodId', 'name price');

  if (!order) return res.status(404).send('Order not found.');
  res.send(order);
});

// GET orders by user ID
router.get('/user/:userId', auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId))
    return res.status(400).send('Invalid user ID.');

  const orders = await Order.find({ userId: req.params.userId })
    .populate('foods.foodId', 'name price');

  res.send(orders);
});

// POST create new order
router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id);
  if (!user) return res.status(400).send('Invalid user.');

  const orderFoods = [];

  for (const item of req.body.foods) {
    const food = await Food.findById(item.foodId);
    if (!food) return res.status(400).send(`Invalid food item: ${item.foodId}`);

    orderFoods.push({ foodId: food._id, quantity: item.quantity });
  }

  const order = new Order({
    userId: user._id,
    foods: orderFoods
  });

  await order.save();
  const savedOrder = await order.populate('foods.foodId', 'name price');
  res.send(savedOrder);
});

// PUT update an order
router.put('/:id', auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send('Invalid order ID.');

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id);
  if (!user) return res.status(400).send('Invalid user.');

  const orderFoods = [];

  for (const item of req.body.foods) {
    const food = await Food.findById(item.foodId);
    if (!food) return res.status(400).send('Invalid food item.');

    orderFoods.push({ foodId: food._id, quantity: item.quantity });
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      userId: user._id,
      foods: orderFoods,
    },
    { new: true }
  );

  if (!order) return res.status(404).send('Order not found.');
  res.send(order);
});

// DELETE an order
router.delete('/:id', [auth, admin], async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send('Invalid order ID.');

  const order = await Order.findByIdAndRemove(req.params.id);
  if (!order) return res.status(404).send('Order not found.');

  res.send(order);
});

module.exports = router;