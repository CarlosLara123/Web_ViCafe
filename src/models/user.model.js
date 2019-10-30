'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name : String,
    surname : String,
    nickname : String,
    password : String,
    role : String
})

module.exports = mongoose.model('User', userSchema)