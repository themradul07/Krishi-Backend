const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const farmerRoutes = require('./routes/farmer.routes');
const activityRoutes = require('./routes/activity.routes');
const chatRoutes = require('./routes/chat.routes');
const aiRoutes = require('./routes/ai.routes');
const weatherRoutes = require('./routes/weather.routes');
<<<<<<< HEAD
const knowledgeRoutes = require("./routes/knowledge.routes");

=======
const bodyParser = require('body-parser');
const weatheralert = require('./cron/weatherAlert.cron');
>>>>>>> 373506706092d837eface72795e891d054b53edd

const app = express();
app.use(cors());
app.use(express.json());
<<<<<<< HEAD
=======
app.use(bodyParser.json({ limit: '100mb' }));
>>>>>>> 373506706092d837eface72795e891d054b53edd

app.use('/api/auth', authRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/advisory', aiRoutes);
app.use('/api/weather', weatherRoutes);
<<<<<<< HEAD
app.use("/api/knowledge", knowledgeRoutes);
=======
>>>>>>> 373506706092d837eface72795e891d054b53edd


app.get('/', (req, res) => res.send('Krishi Sakhi Backend is running'));

module.exports = app;
