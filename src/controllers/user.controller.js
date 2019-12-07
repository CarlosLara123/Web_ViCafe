'use strict'

const User = require('../models/user.model')
const bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function userRegister(req, res) {
    var user = new User();
    var params = req.body;
    
    if(params.name && params.surname && params.nickname && params.password){
        user.name = params.name;
        user.surname = params.surname;
        user.nickname = params.nickname;
        user.password = params.password;
        user.role = 'ROLE_1';

        User.find({$or:[
            { nickname : user.nickname }
        ]}).exec((err, users)=>{
            if(err) return res.status(500).send({ message: 'ERROR!, algo salio mal' });

            if(users && users.length >= 1){
                return res.status(500).send({message: 'El usuario ya existe'})
            }else{
                bcrypt.hash(params.password, null, null, (err,hash)=>{
                    user.password = hash;

                    user.save((err, userStored)=>{
                        if(err) return res.status(500).send({ message: 'ERROR!, algo salio mal' });
                        if(!userStored) return res.status(404).send({ message: 'ERROR!, algun dato esta mal' });
                        return res.status(200).send({ userSave: userStored, message : 'Nuevo administrador creado' });
                    })
                })
            }
        })
    }
    else if(!params.name) return res.status(500).send({ message: 'ERROR!, nombre vacío' });
    else if(!params.surname) return res.status(500).send({ message: 'ERROR!, apellido vacío' });
    else if(!params.nickname) return res.status(500).send({ message: 'ERROR!, sobrenombre vacío' });
    else if(!params.password) return res.status(500).send({ message: 'ERROR!, contraseña vacía' });
}

function login(req,res) {
    var params = req.body;
    let nick = params.nickname;
    let password = params.password;

    User.findOne({nickname: nick}, (err, user)=>{
        if(err) return res.status(500).send({message: 'error en la peticion'})
        
        if (user) {
            bcrypt.compare(password, user.password, (err, check)=>{
                if (check) {
                    if (params.gettoken) {
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    }else{
                        user.password = undefined;
                        return res.status(200).send({user})
                    }
                }else{
                    return res.status(404).send({message: 'el usuario no a podido identificarse'})
                }   
            })
        }else{
            return res.status(404).send({message: 'el usuario no a podido logearse'})
        }
    
    });
}

module.exports = {
    userRegister,
    login
}