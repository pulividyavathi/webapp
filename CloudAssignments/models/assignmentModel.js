const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');  

class Assignment extends Model {}

Assignment.init(
  {
    id: {
      type: DataTypes.UUID, 
      defaultValue: () => uuidv4(),  
      allowNull: false,
      primaryKey: true,
      readOnly: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {  
          msg: 'Points must be an integer.',
        },
        min: 1,
        max: 10,
      },
    },
    num_of_attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {  
          msg: 'Number of attempts must be an integer.',
        },
        min: 1,
        max: 10,
      },
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,  
      allowNull: false,
    }, 
    // submissions_count: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   defaultValue: 0,
    // },   
    assignment_created: {
      type: DataTypes.DATE,  
      allowNull: false,
      defaultValue: DataTypes.NOW,
      readOnly:true
    },
    assignment_updated: {
      type: DataTypes.DATE,  
      allowNull: false,
      defaultValue: DataTypes.NOW,
      readOnly:true
    },
  },
  {
    sequelize,
    modelName: 'Assignment',
    timestamps: true,  
    createdAt: 'assignment_created',  
    updatedAt: 'assignment_updated',  
  }
);

Assignment.beforeUpdate(async (assignment) => {
  assignment.assignment_updated = new Date();
});

Assignment.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Assignment;
