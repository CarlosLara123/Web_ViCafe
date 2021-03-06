'use strict'

const Publication = require('../models/publication.model')
const path = require('path');
const fs = require('fs');
const moment = require('moment')
const mongoosePaginate = require('mongoose-pagination');
const aws = require('aws-sdk');
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: 'dftejnbqx',
    api_key: '664672147697496',
    api_secret: 'a_iqaz0mjuJfwegq8E99TO9GXh4',
})

function subirImagen(req, res) {
    var publicationId = req.params.id;

    if(req.files){
        
        Publication.findById(publicationId, async (err) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' })
                
            var result = await cloudinary.v2.uploader.upload(req.files.image.path)

                Publication.findByIdAndUpdate(publicationId, { image: result.public_id, url: result.url }, { new: true }, (err, publicationUpdate) => {
                    if (err) return res.status(500).send({ message: 'Error en la peticion' })

                    if (!publicationUpdate) return res.status(404).send({ message: 'no se a podido actualizar el usuario' })

                    if (publicationUpdate) {
                        console.log(result)
                        console.log(publicationUpdate)
                        return res.status(200).send({ publication: publicationUpdate })
                    }
                })
        })
    }

}

function addPublication(req, res) {
    var params = req.body;
    var publication = new Publication()

    if (params.title && params.text) {
        publication.title = params.title;
        publication.text = params.text;
        publication.image = "";
        publication.url = "";

        publication.save((err, newPublication) => {
            if (err) return res.status(500).send({ message: 'ERROR!, algo salio mal' });
            if (!newPublication) return res.status(404).send({ message: 'ERROR!, algún dato esta mal' });
            return res.status(200).send({ newPublication, message: 'Se a publicado un nuevo evento', file: publication.image });
        })

    }
    else if (!params.title) return res.status(500).send({ message: 'ERROR!, no has agregado un título a la publicacion' });
    else if (!params.text) return res.status(500).send({ message: 'ERROR!, la publicación necesita una descripción' });
}

function getOnePublication(req, res) {
    let publicationID = req.params.id;

    Publication.findById({ _id: publicationID }, (err, Publication) => {
        if (err) return res.status(500).send({ message: 'ERROR!, algo salio mal' });
        if (!Publication) return res.status(404).send({ message: 'ERROR!, no se encontro la publicación' });
        return res.status(200).send({ Publication });
    })
}

function getAllPublications(req, res) {
    let page = 1
    let itemsPage = 10

    if (req.params.page) {
        page = req.params.page;
    }

    Publication.find().paginate(page, itemsPage, (err, Publications, total) => {
        if (err) return res.status(500).send({ message: 'ERROR!, algo salio mal' });
        if (!Publications) return res.status(404).send({ message: 'ERROR!, no se encontro la publicación' });
        return res.status(200).send({
            Publications,
            total: total,
            pages: Math.ceil(total / itemsPage),
        });
    })
}

function updateOnePublication(req, res) {
    let publicationID = req.params.id;
    let params = req.body;

    Publication.findByIdAndUpdate(publicationID, params, { new: true }, (err, UpdatePublication) => {
        if (err) return res.status(500).send({ message: 'ERROR!, algo salio mal' });
        if (!UpdatePublication) return res.status(404).send({ message: 'ERROR!, no se puede actualizar' });
        return res.status(200).send({ publication: UpdatePublication, message: 'Se actualizo una publicación' });
    })
}

function deleteOnePublication(req, res) {
    let publicationID = req.params.id;

    Publication.findByIdAndDelete({ _id: publicationID }, (err, deletePublication) => {
        if (err) return res.status(500).send({ message: 'ERROR!, algo salio mal' });
        if (!deletePublication) return res.status(404).send({ message: 'ERROR!, no se pudo eliminar la publicación' });
        return res.status(200).send({ deletePublication, message: 'Se elimino una publicación' });
    })
}

module.exports = {
    subirImagen,
    addPublication,
    getAllPublications,
    getOnePublication,
    updateOnePublication,
    deleteOnePublication
}