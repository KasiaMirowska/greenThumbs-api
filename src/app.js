require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const app = express();
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';
const http = require('http');
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());


app.get('/', (req, res) => {
    console.log(req.url)
    console.log( req.headers, 'HEADERS')
   
    const options = {
        hostname: ' https://api.yelp.com/v3/businesses/search?term=food&location=danvers',
        port: 80,
        path: req.url,
        method: req.method,
        headers: req.headers
    };

    const proxy = http.request(options, function (res) {
        res.writeHead(res.statusCode, res.headers)
        res.pipe(res, {
            end: true
        });
    });

    req.pipe(proxy, {
        end: true
    });

    res.json(res.pipe(res))
});

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app;

