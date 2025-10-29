require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const app = express();
app.use(bodyParser.json());
app.use((req,res,next)=>{ res.header('Access-Control-Allow-Origin','*'); res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization'); next(); });

app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Backend running on ${PORT}`));

const pricesRoutes = require('./routes/prices');
const exportRoutes = require('./routes/export');
app.use('/api/prices', pricesRoutes);
app.use('/api/export', exportRoutes);

const finnhubRoutes = require('./routes/finnhub');
const valueRoutes = require('./routes/value');
app.use('/api/prices/finnhub', finnhubRoutes);
app.use('/api/portfolio/value', valueRoutes);
