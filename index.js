// DOT ENV CONFIG
require('dotenv').config();

const app = require('./src/connection/app');
const db = require('./src/connection/db');

const PORT = process.env.PORT || 5000;

db.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((e) => {
    console.log(e);
  });