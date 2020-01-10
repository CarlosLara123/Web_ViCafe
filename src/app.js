'use strict'

const express = require("express");
const app = express();
const cors = require('cors'); 
const bodyparser = require("body-parser");

//CARGAR RUTAS
var user_routes = require('./routes/user.routes');
var history_routes = require('./routes/history.routes');
var publication_routes = require('./routes/publication.routes');
var farmer_routes = require('./routes/farmer.routes');
// var message_routes = require('./routes/messageRoutes');

//MIDDELWARES
app.use(cors());
app.use(bodyparser.urlencoded({ extended: false}));
app.use(bodyparser.json());

//CABEZERAS
app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE'); 

    next();
});

//RUTAS
app.use('/api', user_routes);
app.use('/api', history_routes);
app.use('/api', publication_routes);
app.use('/api', farmer_routes);
// app.use('/api', message_routes);

//EXPORTAR
module.exports = app;
