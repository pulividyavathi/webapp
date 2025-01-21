const express = require('express')
const router = express.Router()
const {submitAssignment}=require('../controllers/submissionController')
const app = express();

 
 
router.use((req, res, next) => {
    const allowedMethods = ['POST'];
  
    if (!allowedMethods.includes(req.method)) {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    next();
  });
  
router.post('/:id/submission',submitAssignment)
 
module.exports=router
