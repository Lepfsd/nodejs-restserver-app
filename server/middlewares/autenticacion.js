const jwt = require('jsonwebtoken');


//verificar token

let verificarToken = ( req, res, next ) => {
	
	let token = req.get('token');
	jwt.verify(token, process.env.SEED, (err, decoded) => {

		if (err) {
			return res.status(401).json({
				ok: false,
				err: {
					message: 'Token no válido'
				}
			});
		}

		req.usuario = decoded.usuario;
		next();
	});

};

//verificar role

let verificarRole = ( req, res, next ) => {
	
	let role = req.body.role;
	
	if(role !== "ADMIN_ROLE") {
		return res.status(400).json({
			ok: false,
			err: {
				message: 'Rol no válido'
			}
		});
	}  else {
		next();
	}
	
} 

let verificaTokenImg = (req, res, next) => {
	
	let token = req.query.token;

	jwt.verify(token, process.env.SEED, (err, decoded) => {

		if (err) {
			return res.status(401).json({
				ok: false,
				err: {
					message: 'Token no válido'
				}
			});
		}

		req.usuario = decoded.usuario;
		next();
	});
}

module.exports = {
	verificarToken, 
	verificarRole,
	verificaTokenImg
}