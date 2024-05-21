const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const app = express();


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['POST'],
};
app.use(cors());




const puerto =process.env.port || 4000;

app.listen(puerto,()=>{
    console.log(`Escuchando en el puerto ${puerto}`);
})