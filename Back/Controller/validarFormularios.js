const conn = require("../model/conn").promise();

const validarFormularios = async (req, res) => {
    try {
        const { datosEmpresa, cantidadProductos, productos } = req.body;
        const { nomempresa, nitempresa, emailempresa, fecha, nompersona } = datosEmpresa;
        console.log(req.body);
        console.log("Si llegaron");

        const consulta = "SELECT * FROM empresa WHERE nombre_empresa=? AND nit=? AND correo=?";
        const [verificar] = await conn.query(consulta, [nomempresa, nitempresa, emailempresa]);
        console.log(verificar);

        if (verificar.length > 0) {
            const cons = "INSERT INTO factura (fecha_reporte, empresa_id, nombre_reportador, cantidad_productos, des_product) VALUES (?, ?, ?, ?, ?)";
            await conn.query(cons, [fecha, verificar[0].id_empresa, nompersona, cantidadProductos, JSON.stringify(productos)]);

            res.send({ message: "Exitoso" });
        } else {
            console.log(req.body);
            const consultar = "INSERT INTO empresa(nombre_empresa, nit, correo) VALUES (?, ?, ?)";
            const [peticion] = await conn.query(consultar, [nomempresa, nitempresa, emailempresa]);
            console.log(peticion);

            if (peticion.affectedRows > 0) {
                const insercionFactura = "INSERT INTO factura (fecha_reporte, empresa_id, nombre_reportador, cantidad_productos, des_product) VALUES (?, ?, ?, ?, ?)";
                await conn.query(insercionFactura, [fecha, peticion.insertId, nompersona, cantidadProductos, JSON.stringify(productos)]);
            }
            res.status(200).send({ message: "Empresa registrada y factura registrada" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error en el servidor" });
    }
};

module.exports = { validarFormularios };
