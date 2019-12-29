'use strict'

var History = require('../models/history.model');
const path = require('path');
const fs = require('fs');
const aws = require('aws-sdk');

var s3 = new aws.S3({
    accessKeyId: 'AKIAI7LPWYEZCYVBVWBQ',
    secretAccessKey: '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'
});

function addHistory(req, res) {
    let history = new History();
    var params = req.body;

    if(params.year && params.text && params.title){
        history.title = params.title;
        history.year = params.year;
        history.text = params.text;
        history.image = "";

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
        var file_path = req.files.image.path;
        console.log(file_path);

        var file_split = file_path.split('\\');
        console.log(file_split);

        var file_name = file_split[3];
        console.log(file_name);

        var ext_xplit = file_name.split('\.');
        console.log(ext_xplit);

        var file_ext = ext_xplit[1];
        console.log(file_ext);

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif' || file_ext == 'jfif'){
            
            History.findOne({_id: historyID}).exec((err, history)=>{
                if(err) return res.status(500).send({message: "Error en la peticion"});
                if(history){
                    History.findByIdAndUpdate(historyID, { image : file_name}, {new:true},(err, result)=>{
                        if(err) return res.status(500).send({message: 'Error en la peticion'})
                        
                        if(!result) return res.status(404).send({message: 'no se a podido actualizar la historia'})
                        
                        if(result){
                            var params = {
                                Bucket: 'covicafe-assets',
                                Key: file_name,
                                Body: file_path
                            }
                            s3.upload(params, (err, data)=>{
                                if(err){
                                    console.log('no se pudo')
                                    throw err;
                                }else{
                                    console.log('S3 success', data)
                                    return res.status(200).send({ result })
                                }
                            })      
                        }
                    })
                }else{
                    return removeFilerOfUploads(res, file_path, 'No tienes permiso para actualizar esta historia')
                }
            });            
        }else{
            return removeFilerOfUploads(res, file_path, 'Extension no valida')
        }
    }
}

function removeFilerOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err)=>{
        return res.status(200).send({message: message})
    })
}

function getImageFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './src/uploads/history/' + image_file;

    fs.exists(path_file, (exists) =>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'no existe la imagen'})
        }
    })
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