
# WebApp Project

## Table of Contents
- [WebApp Project](#webapp-project)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Project Structure](#project-structure)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Setup Instructions](#setup-instructions)
  - [Usage](#usage)
  - [Testing](#testing)
  - [GitHub Actions](#github-actions)
    - [Workflow Steps](#workflow-steps)
  - [Contributing](#contributing)

## Introduction

This project is a comprehensive web application designed with multiple functionalities, featuring backend services, configuration files, and monitoring setups. It showcases cloud integration, metrics collection, and robust backend APIs.

## Project Structure

Below is an overview of the project structure:

```
webapp/
├── cloudwatch.json            # AWS CloudWatch configuration
├── SetupScript.sh             # Script for initial setup
├── aws-debian.pkr.hcl         # Packer configuration for AWS Debian images
├── variables.pkr.hcl          # Variables file for Packer
├── csye.service               # Systemd service file
├── CloudAssignments/          # Main application directory
│   ├── logger.js              # Logging utility
│   ├── test.js                # Test script
│   ├── test1.js               # Additional test script
│   ├── server.js              # Main server file
│   ├── package.json           # Node.js dependencies
│   ├── package-lock.json      # Dependency lock file
│   ├── metrics/               # Metrics collection
│   │   └── metrics.js         # Metrics handling logic
│   ├── config/                # Configuration files
│   │   └── dbConfig.js        # Database configuration
│   ├── models/                # Database models
│   │   ├── submissionModel.js # Submission model
│   │   ├── userModel.js       # User model
│   │   └── assignmentModel.js # Assignment model
│   ├── controllers/           # Controllers for business logic
│   │   ├── submissionController.js
│   │   ├── assignmentController.js
│   │   └── userController.js
│   ├── routes/                # API routes
│       ├── assignmentRoute.js
│       ├── userRoute.js
│       └── submissionRoute.js
└── opt/
    └── users.csv              # Sample user data
```

## Features

- REST API implementation for assignments, users, and submissions.
- Logging and metrics collection for observability.
- CloudWatch integration for monitoring.
- Database configuration and models for data persistence.
- Systemd service setup for managing server processes.

## Technologies Used

- **Node.js**: Backend development.
- **Express.js**: Framework for building APIs.
- **AWS CloudWatch**: Monitoring and observability.
- **Packer**: Image building for AWS.
- **Systemd**: Service management.

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd webapp
   ```

2. **Install Dependencies**
   Navigate to the `CloudAssignments` directory and install the required dependencies:
   ```bash
   cd CloudAssignments
   npm install
   ```

3. **Database Setup**
   - Update the `config/dbConfig.js` file with your database credentials.

4. **Run the Server**
   Start the application server:
   ```bash
   node server.js
   ```

5. **CloudWatch Configuration**
   - Ensure AWS credentials are set up correctly.
   - Use the `cloudwatch.json` file to configure CloudWatch.

6. **Service Setup**
   Deploy the systemd service using the `csye.service` file:
   ```bash
   sudo cp csye.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl start csye.service
   sudo systemctl enable csye.service
   ```

## Usage

Access the API endpoints via:
- `http://<host>:<port>/api/users`
- `http://<host>:<port>/api/assignments`
- `http://<host>:<port>/api/submissions`

Use tools like Postman or cURL to interact with the API.

## Testing

The project includes testing scripts for verifying the functionality of the APIs and other components.

1. **Run Tests**
   Navigate to the `CloudAssignments` directory and execute the test scripts:
   ```bash
   node test.js
   node test1.js
   ```

2. **Coverage**
   Ensure all APIs and features are covered in the tests to validate application stability.

3. **Manual Testing**
   - Use Postman or similar tools to manually test the endpoints.
   - Validate inputs, outputs, and edge cases.

## GitHub Actions

The project includes GitHub Actions workflows to automate the build, test, and deployment processes, including creating custom AMIs.

### Workflow Steps

1. **Build and Test**
   - Installs dependencies and runs tests to validate the application.
   - Ensures code quality and stability.

2. **Custom AMI Creation**
   - Uses Packer with the `aws-debian.pkr.hcl` and `variables.pkr.hcl` files to create custom AMIs.
   - Automates image building with preconfigured settings.

3. **Deployment**
   - Deploys the application to the configured environment using systemd.
 

## Contributing

Contributions are welcome! Please follow the steps below to contribute:
1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit them.
4. Submit a pull request.

 
