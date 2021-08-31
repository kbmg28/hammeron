//Install express server

const express = require('express');
const path = require('path');

const app = express();

const appName = require('./package.json').name;

// Serve only the static files form the dist directory
app.use(express.static(`./dist/${appName}`));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: `dist/${appName}`}),
);

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 9000);
