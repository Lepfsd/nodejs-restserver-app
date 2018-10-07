require('./config/config');

const express = require('express')
const mongoose = require('mongoose')

const app = express()
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//config global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, (err, res) => {
	 if( err ) throw err;
	 console.log('base de datos online');
});
 
app.listen(process.env.PORT, () => {
	console.log('Escuchando desde el puerto: ', process.env.PORT);
});