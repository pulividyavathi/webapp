
Cloud Course Assignment Project Welcome to the Cloud Course Assignment project! This project has been developed using Node.js and Express.js. Below, you'll find instructions on setting up the environment, running the server, and testing the API endpoints.

Environment Setup Install Node.js:

Download and install Node.js by following the instructions at Node.js Download. Clone the Repository:

Clone this repository to your local machine. Install Dependencies:

Open a terminal and navigate to the cloned repository. Run the following command to install all the required packages mentioned in the dependencies section of package.json: npm install Running the Server To start the server, follow these steps:

Ensure you are in the project directory in your terminal.
test
Run the following command:


node server.js The server will start, and by default, it will listen on port 8080 as specified in the .env file.

Testing API Endpoints For testing the API endpoints, it's recommended to use Postman. The API specifications can be found https://app.swaggerhub.com/apis-docs/csye6225-webapp/cloud-native-webapp/fall2023-a3#/


Generate an SSL certificate for the development account using AWS Certificate Manager.

For the demo subdomain, import an SSL certificate from a vendor such as Namecheap into AWS. Use the specified command to facilitate the import process.

sudo aws acm import-certificate --profile demo --certificate fileb://demo.learnright.me.crt --certificate-chain fileb://demo.learnright.me.ca-bundle --private-key fileb://~/private.key


 
