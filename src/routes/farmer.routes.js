'use strict'

var express = require("express");
var FarmerController = require('../controllers/farmer.controller');
var md_auth = require('../middlewares/authenticated');

//SUBIR IMAGEN
var multiparty = require('connect-multiparty');
var md_subir = multiparty({uploadDir: './src/uploads/farmers'});

var api = express.Router();

api.post('/farmer/add', md_auth.ensureAuth,FarmerController.addFarmer);
api.post('/upload-image-farmer/:id', [md_auth.ensureAuth, md_subir], FarmerController.subirImagen);
api.get('/farmer/all', FarmerController.getAllFarmers);
api.get('/farmer/:id', FarmerController.getOneFarmer);
api.get('/get-image-farmer/:imageFile', FarmerController.getImageFile);
api.put('/farmer/update/:id', FarmerController.updateOneFarmer);
api.delete('/farmer/delete/:id', FarmerController.deleteOneFarmer);
module.exports = api;