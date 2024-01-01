const express = require('express');
const supertest = require('supertest');
const axios = require('axios');

// Import the router module
const cryptoRoutes = require('../routes/crypto');

// Mocking the axios library
jest.mock('axios');

// Create an Express app and use the cryptoRoutes
const app = express();
app.use('/api', cryptoRoutes);

const Data = [
    {
        "id": "bitcoin",
        "symbol": "btc",
        "name": "Bitcoin",
        "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400",
        "current_price": 42474,
        "market_cap": 831760649325,
        "market_cap_rank": 1,
        "fully_diluted_valuation": 891787821869,
        "total_volume": 11723484740,
        "high_24h": 42838,
        "low_24h": 42095,
        "price_change_24h": -79.00738699815702,
        "price_change_percentage_24h": -0.18567,
        "market_cap_change_24h": -240498095.3482666,
        "market_cap_change_percentage_24h": -0.02891,
        "circulating_supply": 19586468,
        "total_supply": 21000000,
        "max_supply": 21000000,
        "ath": 69045,
        "ath_change_percentage": -38.45928,
        "ath_date": "2021-11-10T14:24:11.849Z",
        "atl": 67.81,
        "atl_change_percentage": 62562.25536,
        "atl_date": "2013-07-06T00:00:00.000Z",
        "roi": null,
        "last_updated": "2024-01-01T07:59:22.677Z"
    }
];

describe('/api/crypto-currencies endpoint', () => {
    it('should return the top 100 crypto currencies with default currency (USD)', async () => {
        // Mock data for the response
        const mockData = Data;

        // Mocking the axios get function to resolve with mockData
        axios.get.mockResolvedValue({ data: mockData });

        // Make a request to the endpoint using supertest
        const response = await supertest(app).get('/api/crypto-currencies');

        // Assert the response status and body
        expect(response.status).toBe(200);
        expect(response.body.currencies).toEqual(mockData);
    });

    it('should return the top 100 crypto currencies with a specified currency', async () => {
        // Mock data for the response
        const mockData = Data;

        // Mocking the axios get function to resolve with mockData
        axios.get.mockResolvedValue({ data: mockData });

        // Make a request to the endpoint with a specified currency using supertest
        const response = await supertest(app).get('/api/crypto-currencies?supportedCurrencies=eur');

        // Assert the response status and body
        expect(response.status).toBe(200);
        expect(response.body.currencies).toEqual(mockData);
    });

    it('should handle errors and return a 500 status code with an error message', async () => {
        // Mocking an error scenario by rejecting the axios get function
        axios.get.mockRejectedValue(new Error('Mocked error message'));

        // Make a request to the endpoint using supertest
        const response = await supertest(app).get('/api/crypto-currencies');

        // Assert the response status and error message
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Internal Server Error');
    });
});

describe('/api/currency-conversion endpoint', () => {
    it('should return the converted amount for a single source crypto and target currency', async () => {
        // Mock data for the response from Coingecko API
        const mockData = {
            bitcoin: { usd: 42521 },
        };

        // Mocking the axios get function to resolve with mockData
        axios.get.mockResolvedValue({ data: mockData });

        // Make a request to the endpoint using supertest
        const response = await supertest(app)
            .get('/api/currency-conversion?sourceCrypto=bitcoin&targetCurrency=usd&amount=2');

        // Assert the response status and body
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            bitcoin: {
                usd: 85042, // Expected converted amount based on the mock data
            },
        });
    });

    it('should return the converted amount for multiple source cryptos and target currencies', async () => {
        // Mock data for the response from Coingecko API
        const mockData = {
            bitcoin: { usd: 42521, inr: 3536102 },
            '0chain': { usd: 0.29993, inr: 24.95 },
        };

        // Mocking the axios get function to resolve with mockData
        axios.get.mockResolvedValue({ data: mockData });

        // Make a request to the endpoint using supertest
        const response = await supertest(app)
            .get('/api/currency-conversion?sourceCrypto=bitcoin,0chain&targetCurrency=usd,inr&amount=2');

        // Assert the response status and body
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            bitcoin: {
                usd: 85042, 
                inr: 7072204,
            },
            '0chain': {
                usd: 0.59986,
                inr: 49.9,
            },
        });
    });

    it('should handle errors and return a 500 status code with an error message', async () => {
        // Mocking an error scenario by rejecting the axios get function
        axios.get.mockRejectedValue(new Error('Mocked error message'));

        // Make a request to the endpoint using supertest
        const response = await supertest(app)
            .get('/api/currency-conversion?sourceCrypto=bitcoin&targetCurrency=usd&amount=2');

        // Assert the response status and error message
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Internal Server Error');
    });
});