const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const config = require('config');
const admin = require("../middleware/admin");
const asyncMiddleware = require('../middleware/async');
const jwt = require('jsonwebtoken');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', [auth, admin], async (req, res) => {
    const user = await User.find().sort('-name');
    res.send(user);
  });

router.get('/me',auth ,  async(req, res) =>{
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
})

router.post('/', async(req, res) =>{
        const {error} = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({email: req.body.email});
        if(user) return res.status(400).send('user already registered');

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt);    

        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashed,
            address: req.body.address,
            phone: req.body.phone

        });
        await user.save();

        const token = user.generateAuthToken();
        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name' , 'email', 'address']));
    });
module.exports = router;



