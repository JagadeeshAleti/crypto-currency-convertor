const express = require('express');
const cors = require('cors');
const cryptoRouter = require('./routes/crypto');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

app.use('/api', cryptoRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});