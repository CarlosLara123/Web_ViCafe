'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var historySchema = mongoose.Schema({
    title : String,
    year : String,
    text : String,
    image : String,
    url : String
})

module.exports = mongoose.model('History', historySchema)