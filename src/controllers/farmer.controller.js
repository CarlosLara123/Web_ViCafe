'use strict'

const Farmer = require('../models/farmer.model')
const path = require('path');
const fs = require('fs');
const moment = require('moment')
const mongoosePaginate = require('mongoose-pagination');
const aws = require('aws-sdk');

var s3 = new aws.S3({
    accessKeyId: 'AKIAI7LPWYEZCYVBVWBQ',
    secretAccessKey: '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'
});

function subirImagen(req, res) {
    var farmerId = req.params.id;

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
            
            Farmer.findOne({_id: farmerId}).exec((err, farmer)=>{
                if(err) return res.status(500).send({message: "Error en la peticion"});
                if(farmer){
                    Farmer.findByIdAndUpdate(farmerId, {image: file_name}, {new:true},(err, updateFarmer)=>{
                        if(err) return res.status(500).send({message: 'Error en la peticion'})
                        
                        if(!updateFarmer) return res.status(404).send({message: 'no se a podido agregar la imagen'})
                        
                        if(updateFarmer){
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
                                    return res.status(200).send({farmer: updateFarmer})
                                }
                            })      
                        }
                    })
                }else{
                    return removeFilerOfUploads(res, file_path, 'No tienes permiso para actualizar esta publicacion')
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
    var path_file = './src/uploads/farmers/' + image_file;

    fs.exists(path_file, (exists) =>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'no existe la imagen'})
        }
    })
}

function addFarmer(req, res) {
    var params = req.body;
    var farmer = new Farmer()

    if(params.name && params.tasa && params.coffes && params.contact){

        farmer.name = params.name;
        farmer.tasa = params.tasa + " SCAA";
        farmer.coffes = params.coffes;
        farmer.address = params.address;
        farmer.contact = params.contact;
        farmer.image = "";

        farmer.save((err, newFarmer)=>{
            if(err) return res.status(500).send({ message: 'ERROR!, algo salio mal' });
            if(!newFarmer) return res.status(404).send({ message: 'ERROR!, algún dato esta mal' });
            return res.status(200).send({ farmer: newFarmer, message : 'Se a regirstrado un nuevo socio' });
        })

    }
    else if(!params.name) return res.status(500).send({ message: 'ERROR!, no has agregado un título a la publicacion' });
    else if(!params.tasa) return res.status(500).send({ message: 'ERROR!, la publicación necesita una descripción' });
    else if(!params.coffes) return res.status(500).send({ message: 'ERROR!, no has agregado un título a la publicacion' });
    else if(!params.contact) return res.status(500).send({ message: 'ERROR!, la publicación necesita una descripción' });
    
}

function getOneFarmer(req, res){
    let farmerID = req.params.id;

    Farmer.findById({_id : farmerID}, (err, farmer)=>{
        if(err) return res.status(500).send({ message: 'ERROR!, algo salio mal' });
        if(!farmer) return res.status(404).send({ message: 'ERROR!, no se encontro al socio' });
        return res.status(200).send({ farmer });
    })
}

function getAllFarmers(req, res){
    let page = 1
    let itemsPage = 10

    if(req.params.page){
        page = req.params.page;
    }

    Farmer.find().paginate(page,itemsPage,(err,farmers,total)=>{
        if(err) return res.status(500).send({ message: 'ERROR!, algo salio mal' });
        if(!farmers) return res.status(404).send({ message: 'ERROR!, no se encontro ningun socio' });
        return res.status(200).send({ 
            farmers,
            total: total,
            pages: Math.ceil(total/itemsPage),
         });
    })
}

function updateOneFarmer(req,res){
    let farmerID = req.params.id;
    let params = req.body;
    
    Farmer.findByIdAndUpdate(farmerID, params, {new : true}, (err, farmer)=>{
        if(err) return res.status(500).send({ message: 'ERROR!, algo salio mal' });
            if(!farmer) return res.status(404).send({ message: 'ERROR!, no se puede actualizar' });
            return res.status(200).send({ farmer, message : 'Se actualizo al socio' });
    })
}

function deleteOneFarmer(req,res){
    let farmerID = req.params.id;
    
    Farmer.findByIdAndDelete( farmerID, (err, farmer)=>{
        if(err) return res.status(500).send({ message: 'ERROR!, algo salio mal' });
            if(!farmer) return res.status(404).send({ message: 'ERROR!, no se pudo eliminar' });
            return res.status(200).send({ farmer, message : 'Se elimino al socio' });
    })
}

module.exports = {
    subirImagen,
    getImageFile,
    addFarmer,
    getAllFarmers,
    getOneFarmer,
    updateOneFarmer,
    deleteOneFarmer
}