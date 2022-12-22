'use strict';

const Path = require('path');
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');

async function main() {

    const server = Hapi.server({
        port: process.env.NODE_PORT || 88,
        host: process.env.NODE_HOST || '127.0.0.1',
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'dist')
            }
        }
    });

    await server.register(Inert);

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

main();