import { useState } from "react";
import axios from "axios"
import { CONVERTED_AMOUNT, CRYPTO_CONVERTER } from "../../constants";
import { CurrencyConversionForm } from "../../components/currency-conversion-form/currency-conversion-form";
import { Config } from "../../config";
import './styles.css';

export const CryptoConversionCalculator = () => {
    const [convertedAmount, setConvertedAmount] = useState(null);

    async function onSubmit(params) {
        const { data } = await axios.get(`${Config.baseUrl}/currency-conversion`, {
            params
        });
        setConvertedAmount(data[params.sourceCrypto][params.targetCurrency]);
    };

    function changeInput() {
        setConvertedAmount(null);
    };

    return (
        <div className="App">
            <h1>{CRYPTO_CONVERTER}</h1>
            <CurrencyConversionForm onSubmit={onSubmit} changeInput={changeInput} />
            {convertedAmount ? <h2 >{CONVERTED_AMOUNT} {convertedAmount}</h2> : null}
        </div>
    );
}