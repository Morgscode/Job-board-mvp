const app = require('./app');

const port = process.env.NODE_PORT || 3000;

app.listen(port, function() {
    console.log(`app listening on port ${port}`);
});

