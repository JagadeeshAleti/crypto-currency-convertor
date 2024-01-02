import { useEffect } from "react";
import { CONVERTED_AMOUNT, CRYPTO_CONVERTER, RATE_LIMIT_ERROR } from "../../constants";
import { CurrencyConversionForm } from "../../components/currency-conversion-form/currency-conversion-form";
import './styles.css';
import { useCurrencyCalculator } from "../../hooks/useCurrencyCalcutor";
import { Loader } from "../../components/common/loader/loader";

export const CryptoConversionCalculator = () => {
    const { getCrytpoCurrencies,
        getCrytpoCurrenciesState,
        convertCryptoCurrencyState,
        apiRateLimitExceeded,
        convert } = useCurrencyCalculator()

    useEffect(() => {
        getCrytpoCurrencies()
    }, [])

    if (getCrytpoCurrenciesState.loading) {
        return <Loader />
    }

    console.log(apiRateLimitExceeded);
    return (
        <div className="App">
            <h1>{CRYPTO_CONVERTER}</h1>
            <CurrencyConversionForm
                converting={convertCryptoCurrencyState.loading}
                crytpoCurrencies={getCrytpoCurrenciesState.cryptoCurrencies}
                onSubmit={convert}
            />
            {apiRateLimitExceeded ? <p className='apiRateLimitExceeded'>{RATE_LIMIT_ERROR}</p> : null}
            {(convertCryptoCurrencyState.convertedAmount) ?
                <h2 >{CONVERTED_AMOUNT} {convertCryptoCurrencyState.convertedAmount}</h2>
                : null
            }
        </div>
    );
}