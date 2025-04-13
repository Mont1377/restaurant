const Joi = require('joi');
const string = require('joi/lib/types/string');
const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    price:{
        type: Number,
        required: true,
        min: 0
    },
    combination:{
        type: Array
    },
    photo: {
        filename: String,
        url: String
    }
});

const Food = mongoose.model('Food', foodSchema);

function validateFood(food){
    const Schema = {
        name: Joi.string().min(3).required(),
        price: Joi.number().min(0).required(),
        combination: Joi.array()
    };

    return Joi.validate(food, Schema);
}

exports.foodSchema = foodSchema;
exports.Food = Food;
exports.validate = validateFood;