const Assignment = require('../models/assignmentModel');

// const { authenticateUser } = require('../controllers/userController')
const bcrypt=require('bcrypt')
const User=require('../models/userModel')
 const metrics=require('../metrics/metrics')
 const logger=require('../logger')
async function createAssignment(req, res) {
  metrics.increment('create,post');

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
        
      const { name, points, num_of_attempts, deadline } = req.body;
      
      const assignment = await Assignment.create({
        name,
        points,
        num_of_attempts,
        deadline,
        user_id:user.id
      });
      logger.info('Assignment created successfully')
      res.status(201).json(assignment);
    } catch (error) {
      console.error(`Error creating assignment: ${error.message}`);
      logger.error(`Error creating assignment: ${error.message}`);
      res.status(400).json({error:'Bad Request'});
    }
  }

  async function updateAssignment(req, res) {
    metrics.increment('update,put'); 
    try {
       
      const authHeader = req.headers['authorization'];
      
      if (!authHeader) {
        logger.warn('PUT/-Unauthorized access attempt')
        return res.status(401).json({ error: 'Authorization header is missing' });
      }
  
     
      const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');
      const [email, password] = credentials.split(':');
  
      
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        logger.warn('PUT/-Authentication failed,User not found')
        return res.status(401).json({ error: 'Authentication failed. User not found.' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        logger.error('PUT/-Authentication failed, Invalid Password')
        return res.status(401).json({ error: 'Authentication failed. Invalid password.' });
      }

      const {id}=req.params;
      const { name, points, num_of_attempts, deadline } = req.body;
      const assignment=await Assignment.findOne({where:{id}})
      if(!assignment){
        logger.warn('Assingment not found')
       return res.status(404).json({error:'Assignment not found'})
      }
      if(assignment.user_id!==user.id){
        logger.error("PUT/-Forbidden,assignment was not created by the user")
         return res.status(403).json({error:'Forbidden'})
      }
      assignment.name = name;
    assignment.points = points;
    assignment.num_of_attempts = num_of_attempts;
    assignment.deadline = deadline;
    await assignment.save();
    if (!assignment) {
       logger.warn('PUT/-Bad Request')
        return res.status(400).json({ error: 'Bad Request'});
      }
  
      logger.info('Assignment Updated successfully')
      res.status(204).send()
    // res.status(200).json(assignment)
    }catch(error){
       logger.error('PUT/-Bad Request')
        res.status(400).json({message:"Bad Request"})
    }
}

async function getAllAssignments(req,res){
  metrics.increment('Get all assignments,get');
  if (req.headers['content-length'] || req.headers['transfer-encoding'] || Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
    logger.warn("bad request")
    return res.status(400).json({ message: 'Bad Request' });
    
  }
  // if (req.body && Object.keys(req.body).length !== 0) {
  //   return res.status(400).json({ error: 'Bad Request' });
  // }
//   if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
//     logger.warn('GET / - Bad Request: This endpoint does not accept query parameters or request body.');
//     return res.status(400).json({ error: 'Bad Request: This endpoint does not accept query parameters or request body.' });
// }
  // if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
  //   logger.warn('GET / - Bad Request');
  //   return res.status(400).json({ error: 'Bad Request' });
  // }
  
    try {
            
      const authHeader = req.headers['authorization'];
      
      if (!authHeader) {
        logger.warn('GET/-Unauthorized access attempt')
        return res.status(401).json({ error: 'Authorization header is missing' });
      }
  
     
      const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');
      const [email, password] = credentials.split(':');
  
      
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        logger.warn('GET/-Authentication failed,User not found, when trying to get all assignments')
        return res.status(401).json({ error: 'Authentication failed. User not found.' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        logger.error('GET/-Authentication failed, Invalid Password')
        return res.status(401).json({ error: 'Authentication failed. Invalid password.' });
      }

        
        // const assignments = await Assignment.findAll()
        const assignments = await Assignment.findAll({
            where: { user_id: user.id },
          });
          if (assignments.length === 0) {
            logger.error('User has not created any assignments')
            return res.status(403).json({ error: 'Forbidden. User has not created any assignments.' });
          }
          logger.info('GET/- Fetched all assignments successfully')
         res.status(200).json(assignments)
      } catch (error) {
        console.error(`Error fetching assignments: ${error.message}`)
        res.status(400).json({message:"Bad Request"})
      }
}


async function deleteAssignment(req, res) {
  metrics.increment('delete assignment, delete');
  if((Object.keys(req.body).length > 0) || (Object.keys(req.query).length > 0)){
    return res.status(400).json();
  }
  try {      
    const authHeader = req.headers['authorization'];
      
    if (!authHeader) {
      logger.warn('DELETE/-Unauthorized access attempt')
      return res.status(401).json();
    }

   
    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');
    const [email, password] = credentials.split(':');

    
    const user = await User.findOne({ where: { email } });

    if (!user) {
      logger.warn('DELETE/-Authentication failed,User not found')
      return res.status(401).json();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      logger.error('DELETE/-Authentication failed, Invalid Password')
      return res.status(401).json();
    }
   
    const { id } = req.params;
    const assignment = await Assignment.findByPk(id);

    if (!assignment) {
      logger.warn('Assignment not found')
      return res.status(404).json();
    }
    if(assignment.user_id!==user.id){
      logger.warn('Forbidden')
      return res.status(403).json({error:'Forbidden'})
   }


    await assignment.destroy();
    logger.info('Assignment deleted successfully')
    res.status(204).send();
    // res.status(200).json(assignment);
  } catch (error) {
    console.error(`Error deleting assignment: ${error.message}`);
    logger.error(`Error deleting assignment: ${error.message}`);
    res.status(400).json({message:"Bad Request"});
  }
}

async function getAssignment(req, res) {
  metrics.increment('getassignment,get');
  if (req.headers['content-length'] || req.headers['transfer-encoding'] || Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
    logger.warn("bad request")
    return res.status(400).json({ message: 'Bad Request' });
    
  }
   
    try {
     
           
      const authHeader = req.headers['authorization'];
        
      if (!authHeader) {
        logger.warn('GET/-Unauthorized access attempt')
        return res.status(401).json({ error: 'Authorization header is missing' });
      }
  
     
      const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');
      const [email, password] = credentials.split(':');
  
      
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        logger.warn('GET/-Authentication failed,User not found')
        return res.status(401).json({ error: 'Authentication failed. User not found.' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        logger.error('GET/-Authentication failed, Invalid Password')
        return res.status(401).json({ error: 'Authentication failed. Invalid password.' });
      }
      // if(assignment.user_id!==user.id){
      //     return res.status(403).json({error:'Forbidden'})
      //  }
      const { id } = req.params;
      
      const assignment = await Assignment.findByPk(id);
  
      if (!assignment) {
        logger.error('Assignment not found')
        return res.status(404).json({ error: 'Assignment not found' });
      }
      if (assignment.user_id !== user.id) {
        logger.warn('Forbidden access')
        return res.status(403).json({ error: 'Forbidden' });
    }
    
      res.status(200).json(assignment);
    } catch (error) {
      console.error(`Error Finding assignment: ${error.message}`);
      logger.error(`Error Finding assignment: ${error.message}`);
      res.status(400).json({message:"Bad Request" });
    }
  }
 
  module.exports = {
    createAssignment,
    updateAssignment,
    getAllAssignments,
    deleteAssignment,
     getAssignment
  };
  

//   module.exports={createAssignment}
  
   
 