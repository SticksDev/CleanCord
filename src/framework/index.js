const ora = require('ora');
const chalk = require('chalk');
const inquirer = require('inquirer');

// FS Tools 
const fs = require('fs');

// Aixos
const axios = require('axios');

// Vars 
let token;

// Guild Vars
let guildList = [];
let allGuilds = [];

// Friend Vars
let friendsList = [];
let allFriends = [];

// Framework Utils
const utils = require('./utils');


// Spinner
const spinner = ora('Init.')

async function checkToken(token) {
    try {
        let res = await axios.get(`https://discord.com/api/v9/users/@me`, { headers: { Authorization: `${token}` } });
        // Parse JSON
        let json = res.data;
        return json;
    } catch (err) {
        spinner.fail('Failed to check the token.\n' + chalk.red(err));
        process.exit(1);
    }
}

async function callGuildMenu(token, username, id) {
    // Create Prompts
    let guildMenu = [
        {
            type: 'list',
            name: 'guild',
            message: 'Select a Function.',
            choices: [
                "Remove All",
                "Remove One",
                "Remove By Selction/File.",
                "Back",
                "Exit"
            ]
        }
    ]

    let guildMenuRes = await inquirer.prompt(guildMenu)

    switch (guildMenuRes.guild) {
        case "Remove All":
            console.log(chalk.red('Not Implemented Yet.'));
            setTimeout(() => {
                console.clear()
                callGuildMenu(token)
            }, 2000)
            break;
        case "Remove One":
            // Create subprompts
            let guildId = [
                {
                    type: 'input',
                    name: 'guildId',
                    message: 'Enter the Guild ID to leave.'
                }
            ]

            let guildIdRes = await inquirer.prompt(guildId)

            if(guildIdRes.guildId.length === 0) {
                console.log(chalk.red('Please enter a Guild ID.'));
                setTimeout(() => {
                    console.clear()
                    callGuildMenu(token) 
                }, 2000)
                return
            }

            utils.removeOneGuild(token, guildIdRes.guildId)
            break;
        case "Remove By Selction/File.":
            // Create subprompts
            let type = [
                {
                    type: 'list',
                    name: 'type',
                    message: 'Select a Type - File to load the guilds.txt from the resources folder or Selection to select the guilds.',
                    choices: [
                        'File',
                        'Selection'
                    ]
                }
            ]

            let typeRes = await inquirer.prompt(type)
            
            switch (typeRes.type) {
                case 'File':
                    // Check if resources/guilds.txt exists
                    if (!fs.existsSync('./resources/guilds.txt')) {
                        spinner.fail('resources/guilds.txt does not exist - Please make sure you have a guilds.txt file in the resources folder.');
                        process.exit(1);
                    }

                    // Load guilds.txt
                    let guilds = fs.readFileSync('./resources/guilds.txt', 'utf8');

                    // Parse guilds.txt
                    guilds = guilds.split('\n');

                    if(guilds.length === 0) {
                        spinner.fail('resources/guilds.txt is empty or formatted incorrectly. Ensure that guilds are seperated by a new line.');
                        process.exit(1);
                    }

                    // Remove all guilds
                    utils.removeSelectedGuilds(token, guilds)
                    break;
                case 'Selection':
                    // Create subprompts
                    spinner.stop();
                    let guildsIds = [
                        {
                            type: 'input',
                            name: 'guildsIds',
                            message: 'Enter the Guild IDs to leave, separated by a comma.'
                        }
                    ]

                    let guildsIdsRes = await inquirer.prompt(guildsIds)

                    if(guildIdRes.guildId.length === 0) {
                        console.log(chalk.red('Please enter a Guild ID.'));
                        setTimeout(() => {
                            console.clear()
                            callGuildMenu(token)
                        }, 2000)
                        return
                    }

                    // Parse guildsIdsRes.guildsIds
                    guildsIdsRes.guildsIds = guildsIdsRes.guildsIds.split(',');

                    // Check if guildsIdsRes.guildsIds is empty
                    if(guildsIdsRes.guildsIds.length === 0) {
                        console.log(chalk.red('No guilds entered - or guilds entered incorrectly.'));
                        process.exit(1);
                    }

                    // Remove all guilds
                    utils.removeSelectedGuilds(token, guildsIdsRes.guildsIds)
                    break
            }
            case 'Back':
                console.clear()
                callMainMenu(token, username, id)
                break;
            case 'Exit':
                process.exit(1);
                break;
    }
}

async function callMainMenu(token, username, id) {
    console.clear()

    // Check if resources/logo.txt exists
    if (!fs.existsSync('./resources/logo.txt')) {
        spinner.fail('Logo file not found. Please redownload.');
        process.exit(1);
    }
    
    // Print the logo 
    console.log(fs.readFileSync('./resources/logo.txt', 'utf8'));
    console.log(chalk.blue(`\n\nVersion 1.0.0 | Created By SticksDev`));
    console.log(chalk.green(`Welcome ${username} (${id})!`));
    
    // Main Menu
    let mainMenu = [
        {
            type: 'list',
            name: 'mainMenu',
            message: 'Please Choose What You Want To Do',
            choices: [
                'Guild Functions',
                'Friend Functions',
                'Exit'
            ]
        }
    ]

    let mainMenuRes = await inquirer.prompt(mainMenu)

    switch (mainMenuRes.mainMenu) {
        case 'Guild Functions':
            await callGuildMenu(token, username, id)
            break;
        case 'Friend Functions':
            console.log(chalk.red('Not Implemented Yet.'));
            setTimeout(() => {
                callMainMenu(token, username, id)
            }, 2000)
            break;
        case 'Exit':
            process.exit(0);
            break;
    }
}

async function main() {
    console.clear()
   
    spinner.start()
    spinner.text = 'Init: Load Discord Token';

    // Check if resources/token.txt exists
    if (!fs.existsSync('./resources/token.txt')) {
        spinner.fail('Token file not found. Please make sure you have a token.txt file in the resources folder.');
        process.exit(1);
    }

    // Load Discord Token
    token = fs.readFileSync('./resources/token.txt', 'utf8');

    spinner.text = 'Init: Check Discord Token'

    // Check if token is valid
    let tokenRes = await checkToken(token)

    if(!tokenRes.id || !tokenRes.username) {
        spinner.fail('Failed to get user data from Discord. Please make sure you have a valid token.');
        process.exit(1);
    }

    // Call Main Menu
    spinner.stop()
    console.clear()
    await callMainMenu(token, tokenRes.username, tokenRes.id)
}

module.exports = { main }