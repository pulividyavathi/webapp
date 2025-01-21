const express = require('express')
const router = express.Router()
const {createAssignment, updateAssignment, getAllAssignments, deleteAssignment, getAssignment}=require('../controllers/assignmentController')
const app = express();

 
 
router.use((req, res, next) => {
    const allowedMethods = ['PUT', 'POST', 'GET', 'DELETE'];
  
    if (!allowedMethods.includes(req.method)) {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    next();
  });
  
router.post('/',createAssignment)
router.put('/:id',updateAssignment)
router.get('/',getAllAssignments)
router.delete('/:id',deleteAssignment)
router.get('/:id',getAssignment)
module.exports=router
