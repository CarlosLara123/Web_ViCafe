'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var farmerSchema = Schema({
    name : String,
    tasa : String,
    coffes : String,
    address : String,
    image : String,
    url : String
})

module.exports = mongoose.model('Farmer', farmerSchema)