// config.js
const port = process.env.PORT || 3000;
const mongodb_uri = process.env.MONGODB_URI || 'mongodb://localhost/mydb';

export { port, mongodb_uri };