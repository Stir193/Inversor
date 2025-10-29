import React, {useState, useEffect} from 'react'

export default function App(){
  const [txs, setTxs] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token')||'');
  const [portfolioValue, setPortfolioValue] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(()=>{
    if(!token) return;
    fetch('http://localhost:4000/api/portfolio/transactions', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r=>r.json()).then(setTxs).catch(()=>{});
    fetch('http://localhost:4000/api/portfolio/value', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r=>r.json()).then(j=>{ if(j && j.total!=null) setPortfolioValue(j.total); }).catch(()=>{});
  },[token]);

  async function login(){
    const res = await fetch('http://localhost:4000/api/auth/login', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if(res.ok){ setToken(data.token); localStorage.setItem('token', data.token); }
    else alert(data.error || 'Error de login');
  }

  async function register(){
    const res = await fetch('http://localhost:4000/api/auth/register', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if(res.ok){ setToken(data.token); localStorage.setItem('token', data.token); }
    else alert(data.error || 'Error de registro');
  }

  return (
    <div style={{ padding:20, fontFamily:'Arial' }}>
      <h1>Inversor - Web (Simple)</h1>
      {!token ? <div>
        <h3>Login / Registro</h3>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{padding:8, display:'block', marginBottom:8}} />
        <input placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{padding:8, display:'block', marginBottom:8}} />
        <button onClick={login} style={{marginRight:8}}>Entrar</button>
        <button onClick={register}>Registrar</button>
        <p>O usa el usuario de prueba: test@example.com / password123 (solo si ejecutaste seed)</p>
      </div> : <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            {portfolioValue!=null && <div><strong>Valor total: ${portfolioValue.toFixed(2)}</strong></div>}
            <a href="/api/export/transactions" target="_blank" rel="noreferrer">Exportar CSV</a>
          </div>
          <div>
            <button onClick={()=>{ localStorage.removeItem('token'); setToken(''); setTxs([]); }}>Cerrar sesión</button>
          </div>
        </div>
        <h2>Transacciones</h2>
        <ul>
          {txs.map(t=> <li key={t.id}>{t.ticker} {t.type} {t.quantity} @ {t.price}</li>)}
        </ul>
      </div>}
    </div>
  );
}
