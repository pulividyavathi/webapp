require('dotenv').config()  
const express=require('express')
const app=express()
const sequelize = require('./config/dbConfig');
const bodyParser = require('body-parser')
const metrics=require('./metrics/metrics')
const cors = require('cors');
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
})

const userRoute=require('./routes/userRoute')
const assignmentRoute=require('./routes/assignmentRoute')
const submissionRoute=require('./routes/submissionRoute')
const PORT=8080

const logger=require('./logger')
logger.info("In server.js")
app.use(cors());
app.use(express.json())
app.use(bodyParser.json());


app.use('/users',userRoute)
app.use('/v2/assignments',assignmentRoute)
app.use('/v2/assignments',submissionRoute)

 
app.get('/healthz', async (req, res) => {
   metrics.increment('healthz,get');
  
  if (req.headers['content-length'] || req.headers['transfer-encoding'] || Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
    logger.warn("bad request")
    return res.status(400).json({ message: 'Bad Request' });
    
  }
  
  try {
    await sequelize.authenticate();
    res.status(200).json({ message: 'Connected to database' });
    logger.info("Database connected successfully, in healthz app")
  } catch (error) {
    res.status(503).json({ message: 'Disconnected' });
    logger.error("Database disconnected")
  }
});
app.all('/healthz', (req, res) => {
  res
    .status(405)
    .header('Cache-Control', 'no-cache, no-store, must-revalidate')
    .json();
});
 
 

app.all('*', (req, res) => {
  res.status(400).json({ message: 'Bad Request - Undefined Endpoint' });
 
});

app.all('*', (req, res) => {
  res.status(400).json({ message: 'Bad Request - Undefined Endpoint' });
});
// app.use((error, req, res, next) => {
//   if (error instanceof SyntaxError) {
//     res.status(400).json({ message: 'Bad Request - Invalid JSON' });
//   } else {
//     next();
//   }
// });
// app.all('/healthz', (req, res) => {

//   res

//     .status(405)

//     .header('Cache-Control', 'no-cache, no-store, must-revalidate')

//     .json();

// });
sequelize
  .sync()
  .then(() => {
    console.log('Database is connected and synced.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      logger.info(`Server is running on port ${PORT} log`)
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    logger.error("db connection error")
  });

  // app.get('/',(req,res)=>{
	// res.status(200).json({message:"Hello Welcome to Cloud Applications"})
  // })
// app.all('*', (req, res) => {
//   res.set('Cache-Control','no-cache')
//    res.status(405).json();
//  });

 
// app.listen(PORT,()=>{
// 		   console.log(`Node api app is running on ${PORT}`)
// 		})

module.exports={app}