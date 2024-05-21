const express = require('express');
const formulariosController = require('../Controller/validarFormularios');
const formuRutas = express.Router();

formuRutas.post("/registro",formulariosController.validarFormularios);


module.exports= formuRutas;