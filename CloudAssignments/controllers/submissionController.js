 
require('dotenv').config();
 
const AWS = require('aws-sdk');
const Submission = require('../models/submissionModel');
const Assignment=require('../models/assignmentModel')
// const { authenticateUser } = require('../controllers/userController')
const bcrypt=require('bcrypt')
const User=require('../models/userModel')
 const metrics=require('../metrics/metrics')
 const logger=require('../logger')
 AWS.config.update({ region: 'us-west-1' });
 const sns = new AWS.SNS();
 
 
 

 let count_of_submissions=0//for now suppose that the count of no of submissions done is 2, later find a way to count this
 async function submitAssignment(req, res) {
    
    metrics.increment('submit,post');
  
      try {
         
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
          logger.warn('POST/-Unauthorized access attempt')
          return res.status(401).json({ error: 'Authorization header is missing' });
        }
    
       
        const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');
        const [email, password] = credentials.split(':');
    
        
        const user = await User.findOne({ where: { email } });
       
    
        if (!user) {
          logger.warn('POST/-User not found')
          return res.status(401).json({ error: 'Authentication failed. User not found.' });
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
          logger.error('POST/-Authentication failed, Invalid Password')
          return res.status(401).json({ error: 'Authentication failed. Invalid password.' });
        }
          
        const {id}=req.params;
        const {submission_url} = req.body;
       
        const assignment=await Assignment.findOne({where:{id}})
        if(!assignment){
          logger.warn('Assingment not found')
          console.log('assign not found')
         return res.status(404).json({error:'Assignment not found'})
        }
        if (new Date() > assignment.deadline) {
            console.log('Inside date')
            logger.error('POST/-Forbidden, Submission past the deadline');
            return res.status(403).json({ error: 'Forbidden, Submission past the deadline' });
          }
          
          let submissions_count=await Submission.count({
            where:{
                user_id:user.id,
                assignment_id:assignment.id
            }
         })
        if(submissions_count>=assignment.num_of_attempts){
            
          logger.error("POST/-Forbidden,No more attempts left")
           return res.status(403).json({error:`Forbidden-Total number of submissions ${submissions_count}, no more attempts left`})
        }
        console.log("before sub")
        const submission = await Submission.create({
            assignment_id:assignment.id,
            user_id: user.id, 
            submission_url:submission_url
          });
        
          console.log("after sub")
        // publish to sns
        const snsMessage = {
          submission_url,
          email,
        };
    
        const params = {
          Message: JSON.stringify(snsMessage),
 
          TopicArn: process.env.snsTopicArn,
 
        };
    
       // Wrap sns.publish in a try-catch block
    try {
      await sns.publish(params).promise();
      logger.info('Submission done successfully');
      res.status(201).send(submission);
    } catch (snsError) {
      console.log(snsError)
      logger.error('Error publishing to SNS:', snsError);
 
 
      res.status(400).json({ message: 'Bad Request' });
    }

        // logger.info('Submission done successfully')
        // res.status(201).send(submission)
       
      // res.status(200).json(assignment)
      }catch(error){
         logger.error('PUT/-Bad Request')
          res.status(400).json({message:"Bad Request-cannot submit"})
      }
    }
  module.exports={submitAssignment}
