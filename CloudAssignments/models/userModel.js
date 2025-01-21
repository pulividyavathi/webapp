const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const { v4: uuidv4 } = require('uuid');  

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,  
    allowNull: false,
    defaultValue: () => uuidv4(),  
    primaryKey: true,
    readOnly: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    writeOnly: true,
  },
  account_createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
    readOnly:true
  },
  account_updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
    readOnly:true
  },
}, {
  sequelize,
  modelName: 'User',
  timestamps: true,
  createdAt: 'account_createdAt',
  updatedAt: 'account_updatedAt',
});

User.beforeUpdate(async (user) => {
  user.account_updated = new Date();
});

module.exports = User;
