import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const CURRECIES = ['btc', 'eth', 'ltc', 'bch', 'bnb', 'eos', 'xrp', 'xlm', 'link', 'dot', 'yfi', 'usd', 'aed', 'ars', 'aud', 'bdt', 'bhd', 'bmd', 'brl', 'cad', 'chf', 'clp', 'cny', 'czk', 'dkk', 'eur', 'gbp', 'gel', 'hkd', 'huf', 'idr', 'ils', 'inr', 'jpy', 'krw', 'kwd', 'lkr', 'mmk', 'mxn', 'myr', 'ngn', 'nok', 'nzd', 'php', 'pkr', 'pln', 'rub', 'sar', 'sek', 'sgd', 'thb', 'try', 'twd', 'uah', 'vef', 'vnd', 'zar', 'xdr', 'xag', 'xau', 'bits', 'sats'];

function App() {

  const [formData, setFormData] = useState({
    sourceCrypto: '',
    amount: '',
    targetCurrency: 'usd',
  });

  const [sourceCryptos, setSourceCryptos] = useState([]);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState(null);
  const [apiRateLimitExceeded, setApiRateLimitExceeded] = useState(false);

  useEffect(() => {
    getCrytpoCurrencies();
  }, []);

  async function getCrytpoCurrencies() {
    try {
      const { data: { currencies } } = await axios.get('http://localhost:8000/api/crypto-currencies');
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
      if(err?.response?.status === 429) {
        setApiRateLimitExceeded(true);
      }
    }
  };

  function handleInputChange(e) {
    setError(null);
    setConvertedAmount(null);
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

    const params = {
      amount,
      sourceCrypto,
      targetCurrency
    }

    const { data } = await axios.get(`http://localhost:8000/api/currency-conversion`, {
      params
    });
    setConvertedAmount(data[sourceCrypto][targetCurrency]);
  };

  return (
    <div className="App">
      <h1>Crypto Converter</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Source Crypto:</label>
          <select name="sourceCrypto" value={formData?.sourceCrypto} onChange={handleInputChange}>
            {sourceCryptos?.map(crypto => (
              <option key={crypto?.id} value={crypto?.id}>{crypto?.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Target Currency:</label>
          <select name="targetCurrency" value={formData?.targetCurrency} onChange={handleInputChange}>
            {CURRECIES.map(currency => (
              <option key={currency} value={currency}>{currency.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <label>
          Amount:
          <input className={error ? 'error' : ''} type="number" name="amount" value={formData.amount} onChange={handleInputChange} />
        </label>

        <button type="submit">Convert</button>
      </form>

      {convertedAmount !== null && (
        <div>
          <h2>Converted Amount: {convertedAmount}</h2>
        </div>
      )}
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {apiRateLimitExceeded && 
        <p className='apiRateLimitExceeded'>Oops! Please give us a moment to catch our breath, and try again shortly.</p>
      }
    </div>
  );
}

export default App;
