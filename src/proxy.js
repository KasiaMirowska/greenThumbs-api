
const express = require('express');
const app = express();
const http = require('http');

function onRequest(client_req, client_res) {
    console.log('serve:' + client_req.url)

    const options = {
        hostname: ' https://api.yelp.com/v3/businesses/search?term=food&location=danvers',
        port: 80,
        path: client_req.url,
        method: client_req.method,
        headers: client_req.headers
    };

    var proxy = http.request(options, function (res) {
        client_res.writeHead(res.statusCode, res.headers)
        res.pipe(client_res, {
            end: true
        });
    });

    client_req.pipe(proxy, {
        end: true
    });
}

module.exports = onRequest()

