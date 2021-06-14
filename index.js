const express = require('express');
const app = express();
const cors = require('cors');
const { port } = require('./src/config/enviroment');
const router = require('./src/http/router');
const formData = require('express-form-data');
const sequelize = require('./src/config/db_config');
require('./src/models/models');
require('./src/models/associations');

//  server configuration
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
app.use(formData.parse());
app.use('/api', router);

sequelize
  .sync({ force: true })
  .then(() => {
    app.listen(port || 3000, () => {
      console.log('server listening on port: ', port);
    });
  })
  .catch((error) => {
    console.error(error);
  });
