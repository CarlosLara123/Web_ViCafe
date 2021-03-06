'use strict'

var express = require("express");
var HistoryController = require('../controllers/history.controller');
var md_auth = require('../middlewares/authenticated');

//SUBIR IMAGEN
var multiparty = require('connect-multiparty');
var md_subir = multiparty({uploadDir: './src/uploads/history'});

var api = express.Router();

api.post('/history/add', md_auth.ensureAuth, HistoryController.addHistory);
api.post('/upload-image-history/:id', md_auth.ensureAuth, HistoryController.setImagen);
api.get('/history/:id', HistoryController.getOneHistory);
api.get('/history/all/:page?', HistoryController.getAllHistory);
// api.get('/get-image-history/:imagefile', HistoryController.getImageFile);
api.put('/history/update/:id',  md_auth.ensureAuth , HistoryController.updateOneHistory);
api.delete('/history/delete/:id', md_auth.ensureAuth , HistoryController.deleteOneHistory);

module.exports = api;