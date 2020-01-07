'use strict'

var mongoose = require("mongoose");
var app = require('./app');
require ('dotenv').config();


//CONECCION A LA BASE DE DATOS 1tEWpDbnojwjTzSs
mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/Red_Social_JS', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
mongoose.connect('mongodb+srv://daniel:1tEWpDbnojwjTzSs@pruebas-web-jvtug.mongodb.net/Web-Vicafe?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('[ DATABASE RUNNING CORRECTLY ]')

    //CREAR SERVIDOR
    app.set('port', process.env.PORT || 3000);
    app.listen(app.get('port'),()=>{
        console.log(`[ THE SERVER IS RUNNING IN THE PORT: '${app.get('port')}' ]`);
    })
}).catch(err => console.log(err));