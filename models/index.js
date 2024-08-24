const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

function loadModels(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      loadModels(fullPath);
    } else if (file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js') {
      try {
        console.log(`Loading model file: ${fullPath}`);
        const model = require(fullPath)(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
      } catch (error) {
        console.error(`Error loading model file ${file}:`, error);
      }
    }
  });
}

loadModels(__dirname);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database & tables created or updated!');
  })
  .catch(error => {
    console.error('Error creating or updating database & tables:', error);
  });

module.exports = db;
