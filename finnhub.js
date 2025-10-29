const express = require('express');
const router = express.Router();
const db = require('../db');
const fetch = require('node-fetch');

// GET /api/prices/finnhub?ticker=SYMBOL
// Caches price for 5 minutes (300 seconds) in DB table 'prices'
router.get('/', async (req,res)=>{
  const ticker = (req.query.ticker || '').toUpperCase();
  if(!ticker) return res.status(400).json({ error: 'ticker required' });

  // check cache
  db.get('SELECT * FROM prices WHERE ticker = ?', [ticker], async (err,row)=>{
    const now = Math.floor(Date.now()/1000);
    if(row && (now - (row.ts || 0) < 300) && row.price != null){
      return res.json({ ticker, price: row.price, cached: true, ts: row.ts });
    }

    const key = process.env.FINNHUB_KEY;
    if(!key) return res.status(500).json({ error: 'FINNHUB_KEY not configured' });
    try {
      const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(ticker)}&token=${key}`;
      const r = await fetch(url);
      const data = await r.json();
      // Finnhub returns { c: current, h, l, o, pc, t }
      const price = data && data.c ? Number(data.c) : null;
      const ts = Math.floor(Date.now()/1000);
      if(price != null){
        db.run('INSERT OR REPLACE INTO prices (ticker,price,ts) VALUES (?,?,?)', [ticker, price, ts]);
      }
      res.json({ ticker, price, cached: false, raw: data });
    } catch(e){
      res.status(500).json({ error: String(e) });
    }
  });
});

module.exports = router;
