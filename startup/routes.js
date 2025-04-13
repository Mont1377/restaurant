const express = require('express');
const path = require('path');
const foods = require('../routes/foods');
const users = require('../routes/users');
const auth = require('../routes/auth');
const orders = require('../routes/orders');
const error = require('../middleware/error');

module.exports = function(app){
    app.use(express.json());
    app.use('/api/users', users);
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    app.use('/api/foods', foods);
    app.use('/api/auth', auth);
    app.use('/api/orders', orders);
    app.use(error);
}