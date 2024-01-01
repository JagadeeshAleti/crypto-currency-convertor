import { useState, useEffect } from 'react';
import './App.css';

const CURRECIES = ['btc', 'eth', 'ltc', 'bch', 'bnb', 'eos', 'xrp', 'xlm', 'link', 'dot', 'yfi', 'usd', 'aed', 'ars', 'aud', 'bdt', 'bhd', 'bmd', 'brl', 'cad', 'chf', 'clp', 'cny', 'czk', 'dkk', 'eur', 'gbp', 'gel', 'hkd', 'huf', 'idr', 'ils', 'inr', 'jpy', 'krw', 'kwd', 'lkr', 'mmk', 'mxn', 'myr', 'ngn', 'nok', 'nzd', 'php', 'pkr', 'pln', 'rub', 'sar', 'sek', 'sgd', 'thb', 'try', 'twd', 'uah', 'vef', 'vnd', 'zar', 'xdr', 'xag', 'xau', 'bits', 'sats'];

function App() {

  const [formData, setFormData] = useState({
    sourceCrypto: '',
    amount: '',
    targetCurrency: 'usd',
  });

  const [sourceCryptos, setSourceCryptos] = useState([]);
  const [convertedAmount, setConvertedAmount] = useState(8999);
  return (
    <div className="App">
      <h1>Crypto Converter</h1>
      <form onSubmit={() => { }}>
        <div>
          <label>Source Crypto:</label>
          <select name="sourceCrypto" value={''} onChange={() => { }}>
            {sourceCryptos?.map(crypto => (
              <option key={crypto?.id} value={crypto?.id}>{crypto?.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Target Currency:</label>
          <select name="targetCurrency" value={''} onChange={() => { }}>
            {CURRECIES.map(currency => (
              <option key={currency} value={currency}>{currency.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <label>
          Amount:
          <input type="number" name="amount" value={formData.amount} onChange={() => { }} />
        </label>

        <button type="submit">Convert</button>
      </form>
      {convertedAmount !== null && (
        <div>
          <h2>Converted Amount: {convertedAmount}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
