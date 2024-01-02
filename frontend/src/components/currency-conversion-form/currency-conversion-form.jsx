import { useState } from "react";
import { AMOUNT, CONVERT, SOURCE_CRYPTO, TARGET_CURRENCY } from "../../constants";
import { CURRECIES } from "../../currency-list";
import { Select } from "../common/select/select";
import './styles.css';
import { Loader } from "../common/loader/loader";

export const CurrencyConversionForm = ({
    crytpoCurrencies,
    onSubmit,
    converting
}) => {
    const [formData, setFormData] = useState({
        sourceCrypto: crytpoCurrencies[0]?.id,
        amount: '',
        targetCurrency: 'usd',
    });
    const [error, setError] = useState(null);

    function handleInputChange(e) {
        setError(null);
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

    const targetCurrencyOptions = CURRECIES.map(currency => ({
        label: currency?.toUpperCase(),
        value: currency,
    }))

    const sourceCryptosOptions = crytpoCurrencies.map(crypto => ({
        label: crypto?.name,
        value: crypto?.id
    }))
    const { amount, sourceCrypto, targetCurrency } = formData;
    const disableButton = !amount || !sourceCrypto;

    return <form onSubmit={handleSubmit}>
        <Select options={sourceCryptosOptions}
            name="sourceCrypto"
            onChange={handleInputChange}
            label={SOURCE_CRYPTO}
            value={sourceCrypto}
        />
        <Select options={targetCurrencyOptions}
            name="targetCurrency"
            onChange={handleInputChange}
            label={TARGET_CURRENCY}
            value={targetCurrency}
        />
        <div className="form-field">
            <label>{AMOUNT}</label>
            <input className={error ? 'error' : ''} type="number" name="amount" value={amount} onChange={handleInputChange} />
        </div>
        {
            converting ?
            <Loader /> :
            <button disabled={disableButton} type="submit">{CONVERT}</button>
        }
        {error ? <p>{error}</p> : null}
    </form>
}