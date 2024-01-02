import { useState } from "react";
import { Config } from "../config";
import axios from "axios"

export const useCurrencyCalculator = () => {
    const [getCrytpoCurrenciesState, setGetCryptoCurrencyState] = useState({
        cryptoCurrencies: [],
        loading: false,
    })
    const [convertCryptoCurrencyState, setConvertCryptoCurrencyState] = useState({
        convertedAmount: null,
        loading: false,
    })
    const [apiRateLimitExceeded, setApiRateLimitExceeded] = useState(false);

    async function getCrytpoCurrencies() {
        try {
            setApiRateLimitExceeded(false);
            setGetCryptoCurrencyState({loading: true, cryptoCurrencies: []})
            const { data: { currencies } } = await axios.get(`${Config.baseUrl}/crypto-currencies`);
            setGetCryptoCurrencyState({loading: false, cryptoCurrencies: currencies})
        } catch (err) {
            if (err?.response?.status === 429) {
                setApiRateLimitExceeded(true);
            }
            setGetCryptoCurrencyState({loading: false, cryptoCurrencies: []})
        }
    };

    async function convert(params) {
        try {
            setApiRateLimitExceeded(false);
            setConvertCryptoCurrencyState({convertedAmount: null, loading:true})
            const { data } = await axios.get(`${Config.baseUrl}/currency-conversion`, {
                params
            });
            setConvertCryptoCurrencyState({convertedAmount: data[params.sourceCrypto][params.targetCurrency], loading:false})
        } catch (err) {
            if (err?.response?.status === 429) {
                setApiRateLimitExceeded(true);
            }
            setConvertCryptoCurrencyState({convertedAmount: null, loading:true})
        }
    };

    return {
        getCrytpoCurrenciesState,
        getCrytpoCurrencies,
        convert,
        convertCryptoCurrencyState,
        apiRateLimitExceeded,

    }
}