// Run: node seed.js
const db = require('./src/db');
const bcrypt = require('bcrypt');

async function seed(){
  const email = 'test@example.com';
  const plain = 'password123';
  const hashed = await bcrypt.hash(plain, 10);

  db.run('INSERT OR IGNORE INTO users (id,email,password) VALUES (1,?,?)', [email, hashed], function(err){
    if(err) console.error(err);
    else console.log('User ready:', email);
  });

  const txs = [
    [1,'AAPL','buy',2,130.5,new Date().toISOString()],
    [1,'TSLA','buy',1,700.0,new Date().toISOString()],
    [1,'BTC-USD','buy',0.001,30000,new Date().toISOString()]
  ];
  txs.forEach(t=>{
    db.run('INSERT INTO transactions (user_id,ticker,type,quantity,price,date) VALUES (?,?,?,?,?,?)', t, function(err){
      if(err) console.error('tx error', err);
    });
  });

  setTimeout(()=>{ console.log('Seed complete'); process.exit(0); }, 800);
}

seed();
