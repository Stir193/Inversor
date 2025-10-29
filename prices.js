const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Requires process.env.ALPHAVANTAGE_KEY
// Usage: GET /api/prices?ticker=AAPL
router.get('/', async (req, res) => {
  const ticker = (req.query.ticker || '').toUpperCase();
  if(!ticker) return res.status(400).json({ error: 'ticker query required' });
  const key = process.env.ALPHAVANTAGE_KEY;
  if(!key) return res.status(500).json({ error: 'ALPHAVANTAGE_KEY not configured' });

  try {
    // Using Alpha Vantage GLOBAL_QUOTE
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(ticker)}&apikey=${key}`;
    const r = await fetch(url);
    const data = await r.json();
    // AlphaVantage returns "Global Quote" object
    const quote = data['Global Quote'] || {};
    const price = quote['05. price'] || quote['05. Price'] || null;
    const change = quote['09. change'] || null;
    res.json({ ticker, price: price ? Number(price) : null, raw: quote, change });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

module.exports = router;
