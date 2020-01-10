'use strict'

const Farmer = require('../models/farmer.model')
const path = require('path');
const fs = require('fs');
const moment = require('moment')
const mongoosePaginate = require('mongoose-pagination');
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: 'dftejnbqx',
    api_key: '664672147697496',
    api_secret: 'a_iqaz0mjuJfwegq8E99TO9GXh4',
})

function subirImagen(req, res) {
    var farmerId = req.params.id;

    if(req.files){
        
        Farmer.findById(farmerId, async (err) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' })
                
            var result = await cloudinary.v2.uploader.upload(req.files.image.path)

                Farmer.findByIdAndUpdate(farmerId, { image: result.public_id, url: result.url }, { new: true }, (err, farmerUpdate) => {
                    if (err) return res.status(500).send({ message: 'Error en la peticion' })

                    if (!farmerUpdate) return res.status(404).send({ message: 'no se a podido actualizar el socio' })

                    if (farmerUpdate) {
                        console.log(result)
                        console.log(farmerUpdate)
                        return res.status(200).send({ farmer: farmerUpdate })
                    }
                })
        })
    }
}

function addFarmer(req, res) {
    var params = req.body;
    var farmer = new Farmer()

    if(params.name && params.tasa && params.coffes && params.contact){

        farmer.name = params.name;
        farmer.tasa = params.tasa + " SCAA";
        farmer.coffes = params.coffes;
        farmer.address = params.address;
        farmer.image = "";
        farmer.url = "";

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
    addFarmer,
    getAllFarmers,
    getOneFarmer,
    updateOneFarmer,
    deleteOneFarmer
}