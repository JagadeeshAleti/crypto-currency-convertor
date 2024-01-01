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
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;