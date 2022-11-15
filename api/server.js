const env = require('./env');
const app = require('./app');

const port = process.env.NODE_PORT || 3000; 

const server = app.listen(port, function() {
    console.log(`app listening on port ${port}`);
});

process.on('unhandledRejection', async function(err) {
    console.error(err.name, err.message);
    await server.close();
    process.exit(1);
});