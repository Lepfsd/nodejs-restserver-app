const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');
 
// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

	let tipo = req.params.tipo;
	let id = req.params.id;

	if (!req.files) {
		return res.status(400).json({
			ok: false,
			err: {
				message: 'no se ha seleccionado ningún archivo'
			}
		});
	}

	//validar tipo

	let tiposValidos = ['productos', 'usuarios'];
	if( tiposValidos.indexOf( tipo) <0 ) {
		return res.status(400).json({
			ok: false,
			err: {
				message: 'los tipos permitidos son: ' + tiposValidos.join(', '),
				tipo: tipo
			}
		});
	}
	
	 // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	 let archivo = req.files.archivo;
	 let nombreArchivo = archivo.name.split('.');
	 let extension = nombreArchivo[nombreArchivo.length -1];
	 
	 //extensiones permitidas
	 let extensionesValidas = [ 'png', 'jpg', 'gif', 'jpeg'];

	 if( extensionesValidas.indexOf( extension ) < 0 ) {
		 return res.status(400).json({
			 ok: false,
			 err: {
				 message: 'las extensiones permitidas son: ' + extensionesValidas.join(', '),
				 ext: extension
			 }
		 });
	 }

	 //cambiar el nombre del archivo

	 let nombreArchivo2 = `${ id }-${ new Date().getMilliseconds()}.${ extension }`;

	 // Use the mv() method to place the file somewhere on your server
	 archivo.mv(`uploads/${ tipo }/${ nombreArchivo2 }`, (err) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err
			});
		}
		if(tipo === "usuarios") {
			imagenUsuario(id, res, nombreArchivo2);
		} else { 
			imagenProducto(id, res, nombreArchivo2);
		}
		
	  });
});

function imagenProducto(id, res, nombreArchivo2)
{
	Producto.findById(id, (err, productoBD) => {
		if (err) {
			borrarImagen(nombreArchivo2, 'productos');
			return res.status(500).json({
				ok: false,
				err
			});
		}

		if (!productoBD) {
			borrarImagen(nombreArchivo2, 'productos');
			return res.status(400).json({
				ok: false,
				error: {
					mensaje: 'el producto no existe'
				}
			});
		}

		borrarImagen(productoBD.img, 'productos');

		productoBD.img = nombreArchivo2;
		productoBD.save( (err, productoGuardado) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err
				});
			}

			res.status(200).json({
				ok: true,
				usuario: productoGuardado,
				img: nombreArchivo2
			});
		});
	});
}

function imagenUsuario(id, res, nombreArchivo2)
{
	Usuario.findById(id, (err, usuarioBD) => {
		if (err) {
			borrarImagen(nombreArchivo2, 'usuarios');
			return res.status(500).json({
				ok: false,
				err
			});
		}

		if (!usuarioBD) {
			borrarImagen(nombreArchivo2, 'usuarios');
			return res.status(400).json({
				ok: false,
				error: {
					mensaje: 'el usuario no existe'
				}
			});
		}

		borrarImagen(usuarioBD.img, 'usuarios');

		usuarioBD.img = nombreArchivo2;
		usuarioBD.save( (err, usuarioGuardado) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err
				});
			}

			res.status(200).json({
				ok: true,
				usuario: usuarioGuardado,
				img: nombreArchivo2
			});
		});
	});
}

function borrarImagen(nombreImagen, tipo)
{
	let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
	if( fs.existsSync(pathImagen) ) {
		fs.unlink(pathImagen);
	} 
}

module.exports = app;