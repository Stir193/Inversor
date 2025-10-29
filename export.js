const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_secret';
const { Parser } = require('json2csv');

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({error:'No autorizado'});
  const token = auth.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch(e) { return res.status(401).json({error:'Token inválido'}); }
}

router.get('/transactions', authMiddleware, (req,res)=>{
  db.all('SELECT * FROM transactions WHERE user_id = ?', [req.user.id], (err, rows)=>{
    if(err) return res.status(500).json({ error: err.message });
    try {
      const fields = ['id','user_id','ticker','type','quantity','price','date'];
      const parser = new Parser({ fields });
      const csv = parser.parse(rows);
      res.header('Content-Type','text/csv');
      res.attachment('transactions.csv');
      res.send(csv);
    } catch(e){
      res.status(500).json({ error: e.message });
    }
  });
});

module.exports = router;
