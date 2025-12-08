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
const schemeAlert = require('./cron/schemesAlert.cron');
// const cropAlert = require('./cron/cropAlert.cron');
const marketroutes = require('./routes/marketPrice.routes');
const { generateMusic } = require('./services/music.service');
const buyerSellerRoutes = require('./routes/contract.routes');
const agriServiceRoutes = require('./routes/agriService.routes');
const cropOperatoionsAlert = require('./cron/cropOperations.cron');
const taskRoutes = require('./routes/tasks.routes');
const fertilizerRoutes = require('./routes/fertilizer.routes');





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
app.use('/api/schemes', schemeRoutes);
app.use('/api/requirements', buyerSellerRoutes );
app.use('/api/services', agriServiceRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/fertilizer', fertilizerRoutes);

app.use("/api/soil", require("./routes/soil.routes"));



// CRON JOBS
// weatheralert.start();
// cropAlert.start();


// DEFAULT ROUTE
app.get('/', (req, res) => res.send('Krishi Sakhi Backend is running'));
const fs = require("fs");



module.exports = app;
