// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

process.env.CADUCIDAD_TOKEN = 60 * 60  * 24 * 30;

process.env.SEED = 'secret';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/node-zero-exp-cafe';
} 
process.env.URLDB = urlDB;