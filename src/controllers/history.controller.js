'use strict'

var History = require('../models/history.model');
const path = require('path');
const fs = require('fs');
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: 'dftejnbqx',
    api_key: '664672147697496',
    api_secret: 'a_iqaz0mjuJfwegq8E99TO9GXh4',
})

function addHistory(req, res) {
    let history = new History();
    var params = req.body;

    if(params.year && params.text && params.title){
        history.title = params.title;
        history.year = params.year;
        history.text = params.text;
        history.image = "";
        history.url = "";

        history.save((err, historyStored)=>{
            if(err) return res.status(500).send({ message: 'ERROR!, algo salio mal' });
            if(!historyStored) return res.status(404).send({ message: 'ERROR!, no se agregado la historia' });
            return res.status(200).send({ result : historyStored, message : 'Historia agregada' });
        })
    }
    else if(!params.year) return res.status(500).send({ message: 'ERROR!, no ingresaste el año' });
    else if(!params.text) return res.status(500).send({ message: 'ERROR!, te falta la descripción' })
}

function getOneHistory(req, res) {
    let historyID = req.params.id;
    
    History.findById( historyID ,(err, result)=>{
        if(err) return res.status(500).send({ message: 'ERROR!, algo salio mal...' });
        if(!result) return res.status(404).send({ message: 'ERROR!, no se a encontrado ninguna historia' });
        return res.status(200).send({ result });
    })
}

function getAllHistory(req, res){
    let page = 1
    let itemsPage = 10

    if(req.params.page){
        page = req.params.page;
    }

    History.find().sort('year').paginate(page,itemsPage,(err,result,total)=>{
        if(err) return res.status(500).send({ message: 'ERROR!, algo salio mal Ñ' });
        if(!result) return res.status(404).send({ message: 'ERROR!, no se encontraron historias' });
        return res.status(200).send({ 
            result,
            total: total,
            pages: Math.ceil(total/itemsPage),
         });
    })
}

function deleteOneHistory(req, res) {
    let historyID = req.params.id;
    
    History.findByIdAndDelete(historyID,(err, result)=>{
        if(err) return res.status(500).send({ message: 'ERROR!, algo salio mal' });
        if(!result) return res.status(404).send({ message: 'ERROR!, no se a eliminado la historia' });
        return res.status(200).send({ result, message : 'Historia eliminada' });
    })
}

function updateOneHistory(req, res) {
    let params = req.body;
    let historyID = req.params.id;

    History.findByIdAndUpdate(historyID, params, {new : true}, (err, result)=>{
        if(err) return res.status(500).send({ message: 'ERROR!, algo salio mal' });
        if(!result) return res.status(404).send({ message: 'ERROR!, no se a actualizado la historia' });
        return res.status(200).send({ result, message : 'Historia actualizada' });
    })
}

function setImagen(req, res) {
    var historyID = req.params.id;

    if(req.files){
        
        History.findById(historyID, async (err) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' })
                
            var result = await cloudinary.v2.uploader.upload(req.files.image.path)

                History.findByIdAndUpdate(historyID, { image: result.public_id, url: result.url }, { new: true }, (err, historyUpdate) => {
                    if (err) return res.status(500).send({ message: 'Error en la peticion' })

                    if (historyUpdate) {
                        console.log(result)
                        console.log(historyUpdate)
                        return res.status(200).send({ result: historyUpdate })
                    }
                })
        })
    }
}

module.exports = {
    addHistory,
    getOneHistory,
    getAllHistory,
    deleteOneHistory,
    updateOneHistory,
    setImagen,
    getImageFile
}