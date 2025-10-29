const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_secret';

router.post('/register', async (req,res)=>{
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });
  const hashed = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users (email,password) VALUES (?,?)',[email,hashed], function(err){
    if(err) return res.status(400).json({ error: 'Email ya en uso o error' });
    const user = { id: this.lastID, email };
    const token = jwt.sign(user, JWT_SECRET);
    res.json({ token, user });
  });
});

router.post('/login', (req,res)=>{
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err,row)=>{
    if(err || !row) return res.status(400).json({ error: 'Credenciales inválidas' });
    const ok = await bcrypt.compare(password, row.password);
    if(!ok) return res.status(400).json({ error: 'Credenciales inválidas' });
    const user = { id: row.id, email: row.email };
    const token = jwt.sign(user, JWT_SECRET);
    res.json({ token, user });
  });
});

module.exports = router;
