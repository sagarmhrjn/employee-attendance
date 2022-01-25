require('dotenv').config();

const MONGO_DB_HOST = process.env.MONGO_DB_HOST || 'localhost';
const MONGO_DB_PORT = process.env.MONGO_DB_PORT || 27017;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'attendance';

module.exports = {
    MONGO_URI: `mongodb://${MONGO_DB_HOST}:${MONGO_DB_PORT}/${MONGO_DB_NAME}`,
};