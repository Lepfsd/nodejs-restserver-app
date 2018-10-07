const express = require('express');

let { verificarToken } = require('../middlewares/autenticacion');

const app = express();

const Categoria = require('../models/categoria');

app.get('/categoria', (req, res) => {

	let desde = req.query.desde || 0;
	desde = Number(desde);

	let limite = req.query.limite || 0;
	limite = Number(limite);

	Categoria.find()
		.skip(desde)
		.limit(limite)
		.sort('descripcion')
		.populate('usuario', 'nombre email')
		.exec( (err, categorias) => {
			if(err) {
				return res.status(400).json({
					ok: false,
					err
				});
			}

			res.json({
				ok: true,
				categorias: categorias
			});
		}); 
});

app.get('/categoria/:id', (req, res) => {

	let id = req.params.id;

	Categoria.findById( id, (err, categoriaDB) => {
		if(err) {
			return res.status(400).json({
				ok: false,
				err
			});
		}

		res.json({
			ok: true,
			categoria: categoriaDB
		});
	});
});

app.post('/categoria', verificarToken, (req, res) => { 

	let body = req.body;

	let categoria = new Categoria({
		descripcion: body.descripcion,
		usuario: req.usuario._id
	});

	categoria.save( (err, categoriaDB) => {
		if(err) {
			return res.status(500).json({
				ok: false,
				err
			});
		}

		if(!categoriaDB){
			return res.status(400).json({
				ok: false,
				err
			});
		}

		res.status(201).json({
			ok: true,
			categoria: categoriaDB
		});
	});
});

app.put('/categoria/:id', verificarToken, (req, res) => {
	
	let id = req.params.id;
	let body = req.body;

	let desCategoria = {
		descripcion: body.descripcion
	};

	Categoria.findByIdAndUpdate( id, desCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
		if(err) {
			return res.status(500).json({
				ok: false,
				err
			});
		}

		if(!categoriaDB){
			return res.status(400).json({
				ok: false,
				err
			});
		}

		res.json({
			ok: true,
			categoria: categoriaDB
		});
	});
});

app.delete('/categoria/:id', verificarToken, (req, res) => {

	let id = req.params.id;

	Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
		if(err) {
			res.status(500).json({
				ok: false,
				err
			});
		}

		if(!categoriaBorrada) {
			res.status(400).json({
				ok: false,
				error: {
					message: 'categoría no encontrada'
				}
			});
		}

		res.json({
			ok: true,
			categoria: categoriaBorrada
		});
	});
});


module.exports = app;