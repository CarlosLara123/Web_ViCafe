'use strict'

var mongoose = require("mongoose");
var app = require('./app');

//CONECCION A LA BASE DE DATOS
mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/Red_Social_JS', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
mongoose.connect('mongodb+srv://daniel:<password>@pruebas-web-jvtug.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('[ DATABASE RUNNING CORRECTLY ]')

    //CREAR SERVIDOR
    app.set('port', process.env.PORT || 3000);
    app.listen(app.get('port'),()=>{
        console.log(`[ THE SERVER IS RUNNING IN THE PORT: '${app.get('port')}' ]`);
    })
}).catch(err => console.log(err));