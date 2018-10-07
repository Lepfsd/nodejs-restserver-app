const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); 

let Schema = mongoose.Schema;

let rolesValidos = {
	values: ['ADMIN_ROLE', 'USER_ROLE'],
	message: '{VALUE} no es un rol válido'
};

let UsuarioSchema = new Schema({
	nombre: {
		type: String,
		required: [true, 'El nombre es necesario']
	},
	email: {
		type: String,
		required: [true, 'El email es necesario'],
		unique: true
	},
	password: {
		type: String,
		required: [true, 'El password es necesario']
	},
	img: {
		type: String,
		required: false
	},
	role: {
		default: 'USER_ROLE',
		type: String,
		enum: rolesValidos 
	},
	estado: {
		type: Boolean,
		default: true
	},
	google: {
		type: Boolean,
		default: false
	}
});

UsuarioSchema.methods.toJSON = function(){
	let user = this;
	let userObject = user.toObject();
	delete userObject.password;

	return userObject;
}

UsuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser unico'});

module.exports = mongoose.model( 'Usuario', UsuarioSchema );

