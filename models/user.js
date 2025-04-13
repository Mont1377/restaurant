const Joi = require('joi');
const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true
    },
    phone: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255
  },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    address:{
        type:String,
        required: true,
        minlength: 10,
        maxlength: 1024
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
      }
    ]

},{timestamps: true});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
      { _id: this._id, isAdmin: this.isAdmin },
      config.get('jwtPrivateKey')
    );
    return token;
  };
  const User = mongoose.model('User', userSchema);

  function validateUser(user) {
    const schema = {
      name: Joi.string().min(5).max(50).required(),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(1024).required(),
      address: Joi.string().min(10).max(1024).required(),
      phone: Joi.string().min(5).max(255).required()
    };
  
    return Joi.validate(user, schema);
  }

exports.User = User;
exports.validate = validateUser;
exports.userSchema = userSchema;