import { useEffect, useState } from "react";
import { AMOUNT, CONVERT, RATE_LIMIT_ERROR, SOURCE_CRYPTO, TARGET_CURRENCY } from "../../constants";
import axios from "axios";
import { CURRECIES } from "../../currency-list";
import { Select } from "../common/select/select";
import { Config } from "../../config";
import './styles.css';

export const CurrencyConversionForm = ({
    onSubmit,
    changeInput
}) => {
    const [formData, setFormData] = useState({
        sourceCrypto: '',
        amount: '',
        targetCurrency: 'usd',
    });
    const [error, setError] = useState(null);
    const [apiRateLimitExceeded, setApiRateLimitExceeded] = useState(false);
    const [sourceCryptos, setSourceCryptos] = useState([]);

    useEffect(() => {
        getCrytpoCurrencies()
    }, [])

    function handleInputChange(e) {
        setError(null);
        changeInput();
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    async function handleSubmit(e) {
        e.preventDefault();
        const { sourceCrypto, targetCurrency, amount } = formData;
        if (!sourceCrypto) {
            setError("Please select source crypto");
            return;
        }
        if (!amount) {
            setError("Please enter amount");
            return;
        }
        onSubmit({
            amount,
            sourceCrypto,
            targetCurrency
        })
    };

    async function getCrytpoCurrencies() {
        try {
            const { data: { currencies } } = await axios.get(`${Config.baseUrl}/crypto-currencies`);
            if (currencies.length > 0) {
                setFormData(pre => {
                    return {
                        ...pre,
                        sourceCrypto: currencies[0]?.id
                    }
                })
            }
            setSourceCryptos(currencies);
            setApiRateLimitExceeded(false);
        } catch (err) {
            if (err?.response?.status === 429) {
                setApiRateLimitExceeded(true);
            }
        }
    };

    const targetCurrencyOptions = CURRECIES.map(currency => ({
        label: currency?.toUpperCase(),
        value: currency,
    }))

    const sourceCryptosOptions = sourceCryptos.map(crypto => ({
        label: crypto?.name,
        value: crypto?.id
    }))

    return <>
        <form onSubmit={handleSubmit}>
            <Select options={sourceCryptosOptions}
                name="sourceCrypto"
                onChange={handleInputChange}
                label={SOURCE_CRYPTO}
                value={formData?.sourceCrypto}
            />
            <Select options={targetCurrencyOptions}
                name="targetCurrency"
                onChange={handleInputChange}
                label={TARGET_CURRENCY}
                value={formData?.targetCurrency}
            />
            <div className="form-field">
                <label>{AMOUNT}</label>
                <input className={error ? 'error' : ''} type="number" name="amount" value={formData.amount} onChange={handleInputChange} />
            </div>
            <button type="submit">{CONVERT}</button>
        </form>
        {error ? <p>{error}</p> : null}
        {(apiRateLimitExceeded && setSourceCryptos.length === 0) ? <p className='apiRateLimitExceeded'>{RATE_LIMIT_ERROR}</p> : null}
    </>
}