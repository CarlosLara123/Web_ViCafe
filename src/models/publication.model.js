'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var publicationSchema = Schema({
    title : String,
    text : String,
    image : String
})

module.exports = mongoose.model('Publication', publicationSchema)