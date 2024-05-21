const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ruta = require('./Routes/formularioRoutes');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['POST'],
};
app.use(cors(corsOptions));

app.use('/', ruta);

const puerto = process.env.PORT || 4000;

app.listen(puerto, () => {
    console.log(`Escuchando en el puerto ${puerto}`);
});
