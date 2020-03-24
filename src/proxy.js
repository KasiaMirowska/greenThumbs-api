const axios = require('axios')
const express = require('express');
const proxyRouter = express.Router();

proxyRouter
.get('/yelp/', (req, res) => {
    const { term, location } = req.query;

    const headers = {
        "Access-Control-Allow-Headers": "Content-Type, Accept",
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Methods': "GET,HEAD"
    };
    
    axios({
        method: 'get',
        url: `https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}`,
        headers: {
            'Authorization': 'bearer 1tfAV3b5KfUH3KiLwe1QijAOWvXaHKRhdUC04jlCt9nWMg-ZjenkkvwU-5_O-GSJ5_k6sMarkh0RPO8e01kNrQcuTgHtr7LHyeQeSWzcmT9Xgfs9XLt3rk62boE4XnYx',
        },
        responseType: 'stream'
    })
        .then(response => {
            if (response.status === 200) {
                res.writeHead(200, {
                    ...headers, 'Content-Type': response.headers['content-type']
                });
                response.data.pipe(res);
            } else {
                res.writeHead(response.status);
                res.end();
            }
        })
        .catch(res.error)
});

module.exports = proxyRouter;