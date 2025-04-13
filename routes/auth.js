const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const { User } = require('../models/user');

const router = express.Router();

// POST /api/auth - yser Login
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    res.send({ token });
});

// Input validation using Joi
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });

    return schema.validate(req);
}

module.exports = router;




// const bcrypt = require('bcrypt');
// const config = require('config');
// const jwt = require('jsonwebtoken');
// const Joi = require('joi');
// const _ = require('lodash');
// const mongoose = require('mongoose');
// const express = require('express');
// const { Customer } = require('../models/customer');
// const router = express.Router();

// router.post('/', async(req, res) =>{
//         const {error} = validate(req.body);
//         if(error) return res.status(400).send(error.details[0].message);

//         let customer = await Customer.findOne({email: req.body.email});
//         if(!customer) return res.status(400).send('Invalid email or password');

//         const validPassword = await bcrypt.compare(req.body.password, customer.password);
//         if(!validPassword) return res.status(400).send('Invalid email or password');

//         const token = customer.generateAuthToken();
//         res.send(token);
//     });

//     function validate(req){
//         const Schema = {
//             email: Joi.string().min(5).max(255).required().email(),
//             password: Joi.string().min(5).max(255).required()
//         };
    
//         return Joi.validate(req, Schema);
//     }

// module.exports = router;