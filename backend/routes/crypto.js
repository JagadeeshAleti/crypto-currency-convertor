const express = require('express');
const router = express.Router();
const axios = require('axios');

// Api endpoint for top 100 crypto currencies
router.get('/crypto-currencies', async (req, res) => {
    const { supportedCurrencies } = req.params;
    try {
        const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: supportedCurrencies || 'usd',
                order: 'market_cap_desc',
                per_page: 100,
                page: 1,
                sparkline: false,
            },
        });

        res.json({  currencies: data });
    } catch (error) {
        console.error(error.message);
        if(error?.response?.status === 429) {
            return res.status(429).json({ error: "You have sent to many request, please wait for sometime"})
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Api endpoint for currency conversion
router.get('/currency-conversion', async (req, res) => {
    try {
        const { sourceCrypto, amount, targetCurrency } = req.query;
        
        // Fetch real-time exchange rates
        const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
                ids: sourceCrypto,
                vs_currencies: targetCurrency,
            },
        });

        const splitSource = sourceCrypto.split(',');
        const splitTarget = targetCurrency.split(',');

        let result = {};
        splitSource.forEach((source) => {
            result[source] = {};
            splitTarget.forEach((target) => {
                result[source][target] = amount * data[source][target];
            });
        });

        res.json(result);
    } catch (error) {
        console.error(error.message);
        if(error?.response?.status === 429) {
            return res.status(429).json({ error: "You have sent to many request, please wait for sometime"})
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;