require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const session = require('express-session');
const userRoutes = require('./routes/user/userRoutes');
const customerRoutes =require('./routes/customer/customerRoutes')
 
const ordermasterRoutes =require ('./routes/ordermasterRoutes/ordermasterRoutes')

const app = express();
const PORT = process.env.PORT || 5000; 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// User routes
app.use('/user', userRoutes);
app.use('/customer', customerRoutes);
app.use('/orders', ordermasterRoutes);


 

// Sync database and start server
sequelize.sync({ force: false })
  .then(async () => {
    // await sequelize.query("SET TIMEZONE = 'Asia/Kolkata'");

    console.log('Database & tables created!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error creating database & tables:', error);
  });

