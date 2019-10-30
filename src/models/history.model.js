'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var historySchema = mongoose.Schema({
    year : String,
    text : String,
    image : String
})