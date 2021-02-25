const express = require('express');

var fs = require('fs');

const app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.end();
});

app.listen(80, '0.0.0.0');