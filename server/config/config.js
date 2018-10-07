// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 8000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

process.env.CADUCIDAD_TOKEN = '48h';

process.env.SEED = 'secret';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/node-zero-exp-cafe';
} 
process.env.URLDB = urlDB;

// ============================
//  google clinet id
// ============================

process.env.CLIENT_ID = "279881609841-nhs6qcfavr3rdr8rbi45omveksa02fp7.apps.googleusercontent.com";