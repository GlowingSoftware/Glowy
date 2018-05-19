# Glowstone Panel
[![NPM version](https://img.shields.io/npm/v/glowstoneserver.svg)](https://www.npmjs.com/package/glowstoneserver)
[![NPM Downloads](https://img.shields.io/npm/dt/glowstoneserver.svg)](https://www.npmjs.com/package/glowstoneserver)

This is a free Minecraft Server Hosting Control Panel. Don't want to buy Multicraft? Bored of other free panels? Then try this!

## FEATURES
- Very intuitive panel
- Free, open-source and continually updated
- Enable/Disable the registration form
- Every account gets a Minecraft Server
- Working with the powerful tech of NodeJS and Bootstrap

I would like to get some feedback, [so you can tell me in the Spigot thread your opinion and suggestions. I read all ;)](https://www.spigotmc.org/threads/glowstone-panel.227618/)

## HOW TO INSTALL?

### Ubuntu

1 - Glowy needs the power of NodeJS to work. So if you did not install it before, run this command to download the installer:
`curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -`
And then run this command to install NodeJS
```sudo apt-get install -y nodejs```

2 - Glowy needs a MySQL database to save all his data. So you might want to check a tutorial to learn how to create the MySQL database in case you do not have one. Once you have a MySQL database running, run this command in your database:
```CREATE TABLE IF NOT EXISTS `users` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `email` varchar(40) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8;```

3 - Now you are ready to download and install Glowy. Go to the folder where you want to install it (using the command `cd`) and run:
```git clone https://github.com/GlowingSoftware/Glowy/```

4 - Copy `config.json.template` and rename it to `config.json`. Then edit it with your MySQL details so that Glowy can access your database. You can also edit other details

6 - Put the jar file of the server you prefer in the folder /serverVersions/. That jar has to be named server.jar and it will be used to create all the servers

7 - Open run.sh and start using your panel! Be sure that you aren't running anything more in the port number 80.

### General Instructions

1 - You need NodeJS installed and a MySQL database

2 - Download the panel

3 - Run install.bat and wait until it finishes installing some dependencies

4 - Import the sql.sql file in your MySQL database

5 - Copy `config.json.template` and rename it to `config.json`. Then edit it with your MySQL details so that Glowy can access your database. You can also edit other details

6 - Put the jar file of the server you prefer in the root folder. That jar has to be named server.jar and it will be used to create all the servers

7 - Open run.bat and start using your panel! Be sure that you aren't running anything more in the port number 80.

## CONTRIBUTE
Our project is in Github. You can code, improve it and create a Pull Request. After checking your Pull Request, if all is okay, we'll merge it into the project