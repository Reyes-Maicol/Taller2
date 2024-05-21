const conn = require("../model/conn").promise();

const validarFormularios = async (req,res)=>{
    try {
        const {nomempresa,nitempresa,emailempresa,fecha,nompersona,cantproductos,productos}=req.body
        console.log(req.body)
    } catch (error) {
        
    }
};