'use strict'

var express = require("express");
var PublicationController = require('../controllers/publication.controller');
var md_auth = require('../middleware/aunthenticated');

//SUBIR IMAGEN
var multiparty = require('connect-multiparty');
var md_subir = multiparty({uploadDir: './src/uploads/publications'});

var api = express.Router();

api.post('/publication/add', [md_auth.ensureAuth, md_subir],PublicationController.addPublication);
api.post('/upload-image-publication/:id', [md_auth.ensureAuth, md_subir], publicationController.subirImagen);
api.get('/publication/all', PublicationController.getAllPublications);
api.get('/publication/:id', PublicationController.getOnePublication)
api.get('/get-image-publication/:imagefile', PublicationController.getImageFile);
module.exports = api;