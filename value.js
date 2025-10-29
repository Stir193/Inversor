const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_secret';

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({error:'No autorizado'});
  const token = auth.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch(e) { return res.status(401).json({error:'Token inválido'}); }
}

// Helper: get price (prefer Finnhub, fallback AlphaVantage)
async function getPrice(ticker){
  const fhKey = process.env.FINNHUB_KEY;
  if(fhKey){
    const r = await fetch(`http://localhost:4000/api/prices/finnhub?ticker=${encodeURIComponent(ticker)}`);
    const j = await r.json();
    if(j && j.price != null) return j.price;
  }
  const avKey = process.env.ALPHAVANTAGE_KEY;
  if(avKey){
    const r = await fetch(`http://localhost:4000/api/prices?ticker=${encodeURIComponent(ticker)}`);
    const j = await r.json();
    if(j && j.price != null) return j.price;
  }
  return null;
}

router.get('/', authMiddleware, async (req,res)=>{
  db.all('SELECT ticker, type, SUM(quantity) as qty FROM transactions WHERE user_id = ? GROUP BY ticker, type', [req.user.id], async (err, rows)=>{
    if(err) return res.status(500).json({ error: err.message });
    // Compute net quantity per ticker (buy +, sell -)
    const map = {};
    rows.forEach(r=>{
      const t = r.ticker;
      const s = Number(r.qty) * (r.type === 'buy' ? 1 : -1);
      map[t] = (map[t] || 0) + s;
    });
    const tickers = Object.keys(map);
    let total = 0;
    const details = [];
    for(const t of tickers){
      const qty = map[t];
      const price = await getPrice(t);
      const value = price != null ? qty * price : null;
      if(value != null) total += value;
      details.push({ ticker: t, qty, price, value });
    }
    res.json({ total, details });
  });
});

module.exports = router;
