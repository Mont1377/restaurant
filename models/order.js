const Joi = require('joi');
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foods: [new mongoose.Schema(
    {
      foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    },{_id:false}
)]
},{ timestamps: true});

const Order = mongoose.model('Order', orderSchema);

function validateOrder(order) {
  const schema = Joi.object({
    foods: Joi.array().items(
      Joi.object({
        foodId: Joi.string().required(),
        quantity: Joi.number().min(1).required()
      })
    ).required(),
  });

  return schema.validate(order);
}

exports.Order = Order;
exports.validate = validateOrder;