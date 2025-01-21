#!/bin/bash

# sudo mkdir -p /tmp/ec2-user
echo "Script started"
sudo apt update
# sudo apt --assume-yes install mariadb-client mariadb-server -y
# sudo systemctl status mariadb
# sudo systemctl start mariadb
# sudo systemctl enable mariadb

# Automate MySQL Secure Installation
# SECURE_MYSQL=$(expect -c "
# set timeout 10
# spawn sudo mysql_secure_installation

# expect \"Enter current password for root (enter for none):\"
# send \"\r\"

# expect \"Set root password? \[Y/n\]\"
# send \"Y\r\"

# expect \"New password:\"
# send \"Writecode@123\r\"

# expect \"Re-enter new password:\"
# send \"Writecode@123\r\"

# expect \"Remove anonymous users? \[Y/n\]\"
# send \"Y\r\"

# expect \"Disallow root login remotely? \[Y/n\]\"
# send \"Y\r\"

# expect \"Remove test database and access to it? \[Y/n\]\"
# send \"Y\r\"

# expect \"Reload privilege tables now? \[Y/n\]\"
# send \"Y\r\"

# expect eof
# ")

# echo "$SECURE_MYSQL"

# # Execute SQL Commands
# sudo mysql -u root -pWritecode@123 <<EOF
# CREATE DATABASE csye6225;
# GRANT ALL ON csye6225.* TO 'root'@'localhost' IDENTIFIED BY 'Writecode@123';
# FLUSH PRIVILEGES;
# SHOW DATABASES;
# EXIT
# EOF

 
 
# Install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 16
sudo apt install nodejs npm -y
sudo npm install -g npm@9.5.1

 
nodejs --version && npm --version
cd /home/admin/CloudAssignments || exit
# npm i nodemon
# npm i dotenv
# npm i express
npm install
sudo rm .env
 
#create csye user in home/csye directory 
sudo useradd -m -p $(openssl passwd -1 password) csyeuser
sudo cat /etc/passwd
sudo pwd
sudo ls -ltrh

sudo mkdir /home/csyeuser
sudo mkdir /home/csyeuser/webapp
 
sudo cp /home/admin/webapp.zip /home/csyeuser/webapp/

# ls -ltrah /home/csyeuser/webapp/

cd /home/csyeuser/webapp ||exit

# ls -ltrah

sudo unzip /home/csyeuser/webapp/webapp.zip

# sudo ls -ltrah /home/csyeuser/webapp
sudo cp -r /home/csyeuser/webapp/CloudAssignments/* /home/csyeuser/webapp

sudo npm ci
sudo npm install --save
sudo npm install nodemon
sudo npm i winston
sudo npm fund

# ls -ltrah


cd /home/admin/ ||exit


 
 
 
sudo mkdir -p /var/log/tomcat9
 
sudo touch /var/log/tomcat9/csye6225.log

 
sudo touch /opt/csyeLogger.log
 
sudo chown csyeuser:csyeuser /opt/csyeLogger.log
sudo chmod 664 /opt/csyeLogger.log
 

# sudo chmod 664 csye6225.log
 
 
# install the cloudwatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/debian/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
 
sudo cp /home/csyeuser/webapp/cloudwatch.json /home/csyeuser/webapp/amazon-cloudwatch-agent.json
sudo cp /home/csyeuser/webapp/amazon-cloudwatch-agent.json /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
 

# sudo ls -ltrah /opt/aws/amazon-cloudwatch-agent/etc

# configure the cloudwatch agent
 
# sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
#     -a fetch-config \
#     -m ec2 \
#     -c file:cloudwatch.json \
#     -s
 

# start the cloudwatchagent on boot
sudo systemctl enable amazon-cloudwatch-agent

sudo systemctl start amazon-cloudwatch-agent
# check status
sudo systemctl status amazon-cloudwatch-agent

# sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
#     -a fetch-config \
#     -m ec2 \
#     -c file:cloudwatch.json \
#     -s


sudo mv /home/admin/csye.service /etc/systemd/system/csye.service
sudo systemctl daemon-reload
sudo systemctl enable csye
sudo systemctl start csye
sudo echo $?
sudo systemctl status csye


 