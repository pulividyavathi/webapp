const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/dbConfig');
 
const Assignment=require('../models/assignmentModel')
const User=require('../models/userModel')
const { v4: uuidv4 } = require('uuid');  

class Submission extends Model {}

Submission.init(
  {
    id: {
      type: DataTypes.UUID, 
      defaultValue: () => uuidv4(),  
      allowNull: false,
      primaryKey: true,
      readOnly: true
    },
    assignment_id: {
        type: DataTypes.UUID,  
        allowNull: false,
        readOnly: true
      }, 
      user_id: {
        type: DataTypes.UUID,  
        allowNull: false,
        readOnly: true
      }, 
      submission_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true,  
        },
        readOnly: true
      },  
    submission_date: {
      type: DataTypes.DATE,  
      allowNull: false,
      defaultValue: DataTypes.NOW,
      readOnly:true
    },
    submission_updated: {
      type: DataTypes.DATE,  
      allowNull: false,
      defaultValue: DataTypes.NOW,
      readOnly:true
    },
  },
  {
    sequelize,
    modelName: 'Submission',
    timestamps: true,  
    createdAt: 'submission_date',  
    updatedAt: 'submission_updated',  
  }
);

Submission.beforeUpdate(async (Submission) => {
  Submission.submission_updated = new Date();
});

Submission.belongsTo(Assignment, { foreignKey: 'assignment_id' });
Submission.belongsTo(User, { foreignKey: 'user_id' });
module.exports = Submission;
