require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
<<<<<<< HEAD
const MONGO_URI = "mongodb://127.0.0.1:27017/krishi";
=======
const MONGO_URI = process.env.MONGO_URI || '';
>>>>>>> 373506706092d837eface72795e891d054b53edd

(async () => {
  await connectDB(MONGO_URI);

  app.get('/', (req, res) => {
    res.send('API is running...');
  } );


  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
})();
