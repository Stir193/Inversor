const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
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

router.use(authMiddleware);

router.get('/transactions', (req,res)=>{
  db.all('SELECT * FROM transactions WHERE user_id = ?', [req.user.id], (err, rows)=>{
    if(err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/transactions', (req,res)=>{
  const { ticker, type, quantity, price, date } = req.body;
  db.run(
    `INSERT INTO transactions (user_id,ticker,type,quantity,price,date) VALUES (?,?,?,?,?,?)`,
    [req.user.id, ticker, type, quantity, price, date],
    function(err){
      if(err) return res.status(500).json({error: err.message});
      res.json({ id: this.lastID });
    }
  );
});

module.exports = router;
