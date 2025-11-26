const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const farmerRoutes = require('./routes/farmer.routes');
const activityRoutes = require('./routes/activity.routes');
const chatRoutes = require('./routes/chat.routes');
const aiRoutes = require('./routes/ai.routes');
const weatherRoutes = require('./routes/weather.routes');
const schemeRoutes = require('./routes/scheme.routes');
const bodyParser = require('body-parser');
const weatheralert = require('./cron/weatherAlert.cron');
const cropAlert = require('./cron/cropAlert.cron');
const marketroutes = require('./routes/marketPrice.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '100mb' })); 

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/advisory', aiRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/market', marketroutes);
app.use('/api/scheme', schemeRoutes);

// CRON JOBS
// weatheralert.start();
// cropAlert.start();


// DEFAULT ROUTE
app.get('/', (req, res) => res.send('Krishi Sakhi Backend is running'));

module.exports = app;
