const fs = require('fs')
const csv = require('csv-parser')
const User=require('../models/userModel')
const bcrypt=require('bcrypt')
  const metrics=require('../metrics/metrics')
async function loadUsersFromCSV() {
  try {
    const scan = fs.createReadStream('./opt/users.csv');

    scan.pipe(csv())
      .on('data', async (row) => {
         
        try {
          await User.findOrCreate({
            where: { email: row.email },
            defaults: {
              first_name: row.first_name,
              last_name: row.last_name,
              email: row.email,
              password: await bcrypt.hash(row.password, 10),
            },
          });
        } catch (error) {
          console.error(`Error loading user from CSV: ${error.message}`);
        }
      })
      .on('end', () => {
        console.log('Users loaded from CSV.');
      });
  } catch (error) {
    console.error(`File not found or error while opening the CSV file: ${error.message}`);
    res.status(404).json({error:"File not found"})
  }
}

loadUsersFromCSV();

  async function getUsers(req, res) {
    metrics.increment('get all users,get');
    try {
      const users = await User.findAll()
      res.status(200).json(users)
    } catch (error) {
      console.error(`Error fetching users: ${error.message}`)
      res.status(400).json({ error: 'Bad Request' })
    }
  }
  
module.exports={getUsers}