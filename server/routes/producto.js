const express = require('express');

let { verificarToken } = require('../middlewares/autenticacion');

const app = express();

const Producto = require('../models/producto');

app.get('/producto', verificarToken, (req, res) => {

	let desde = req.query.desde || 0;
	desde = Number(desde);

	let limite = req.query.limite || 0;
	limite = Number(limite);

	Producto.find({ disponible: true})
		.skip(desde)
		.limit(limite)
		.populate('usuario', 'nombre email')
		.populate('categoria', 'descripcion')
		.exec( ( err, productos) => {
			if(err) {
				return res.status(400).json({
					ok: false,
					err
				});
			}

			res.status(200).json({
				ok: true,
				productos: productos
			});
		});
});

app.get('/producto/:id', verificarToken, (req, res) => {

	let id = req.params.id;

	Producto.findById(id)
		.populate('usuario', 'nombre email')
		.populate('categoria', 'descripcion')
		.exec( ( err, productoDB)  =>{
			if(err) {
				return res.status(400).json({
					ok: false,
					err
				});
			}

			res.status(200).json({
				ok: true,
				producto: productoDB
			});
		});
});

//buscar productos por termino

app.get('/productos/buscar/:termino', verificarToken, (req, res) => {

	let termino = req.params.termino;
	let regex = new RegExp(termino, 'i');

	Producto.find({ nombre: regex })
		.populate('categoria', 'nombre')
		.exec( (err, productos) => {
			if(err) {
				res.status(500).json({
					ok: false,
					err
				});
			}
			res.status(200).json({
				ok: true,
				productos: productos
			});
		});
});

app.post('/producto', verificarToken, (req, res) => {


	let producto = new Producto({
		nombre: req.body.nombre,
		precioUni: req.body.precioUni,
		descripcion: req.body.descripcion,
		disponible: req.body.disponible,
		categoria: req.body.categoria,
		usuario: req.body.usuario
	});

	producto.save( (err, productoDB) => {

		if(err) {
			res.status(500).json({
				ok: false,
				err
			});
		}

		if(!productoDB) {
			res.status(400).json({
				ok: false,
				error: {
					message: 'Ocurrio un error al guardar el producto'
				}
			});
		}

		res.status(201).json({ 
			ok: true,
			producto: productoDB
		});
	}); 
});

app.put('/producto/:id', verificarToken, (req, res) => {

	let id = req.params.id;
	let body = req.body;

	Producto.findById( id, (err, productoDB) =>{
		if(err) {
			res.status(500).json({
				ok: false,
				err
			});
		}

		if(!productoDB) {
			res.status(400).json({
				ok: false,
				error: {
					message: 'id no existe'
				}
			});
		}

		productoDB.nombre = body.nombre;
		productoDB.precioUni = body.precioUni;
		productoDB.descripcion = body.descripcion;
		productoDB.disponible = body.disponible;
		productoDB.categoria = body.categoria;

		productoDB.save( (err, productoGuardado) => {

			if(err) {
				res.status(500).json({
					ok: false,
					err
				});
			}

			res.status(200).json({
				ok: true,
				producto: productoGuardado
			});
		})
	})
});

app.delete('/producto/:id', verificarToken, (req, res) => {

	let id = req.params.id;

	Producto.findById(id, (err, productoDB) => {
		if(err) {
			res.status(500).json({
				ok: false,
				err
			});
		}

		if(!productoDB) {
			res.status(400).json({
				ok: false,
				error: {
					message: 'id no existe'
				}
			});
		}

		productoDB.disponible = false;
		productoDB.save( (err, productoBorrado) => {
			if(err) {
				res.status(500).json({
					ok: false,
					err
				});
			}

			res.status(200).json({
				ok: true,
				producto: productoBorrado,
				mensaje: 'Producto eliminado'
			});
		});
	});
});

module.exports = app; 