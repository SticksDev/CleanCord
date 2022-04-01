// Imports 
const axios = require('axios').default;
const ora = require('ora');
const chalk = require('chalk');

// Spinners
const spinner = ora('Please Wait...');

let guildTemplateUrl = 'https://discord.com/api/v9/users/@me/guilds/{guildId}';
let guildNameTemplateUrl = 'https://discord.com/api/v9/guilds/{guildId}/preview';


// Helper to get the guildname
async function getGuildName(guildId, token) {
    let url = guildNameTemplateUrl.replace('{guildId}', guildId);

    try {
        let res = await axios.get(url, {
            headers: {
                Authorization: `${token}`
            }
        });

        let json = res.data;
        return json.name;
    } catch (err) {
        return undefined;
    }
}

async function removeAllGuilds(token) {
    console.log(chalk.yellow(`\nNot implemented yet.`));
}

async function removeOneGuild(token, guildId) {
    // Start time
    let startTime = new Date();
    
    // Replace the {guildId} with the guildId
    let url = guildTemplateUrl.replace('{guildId}', guildId);

    // Update the spinner
    spinner.start()
    spinner.text = `Getting guild name for ${guildId}`;

    let name = await getGuildName(guildId, token)

    // Update the spinner
    spinner.text = `Removing guild ${!name ? guildId : name}..`;
    
    try {
        await axios.delete(url, {
            headers: {
                Authorization: `${token}`
            }
        });
        spinner.succeed(`Removed guild ${!name ? guildId : name} successfully!`);

        // End time
        let endTime = new Date() - startTime;
        
        console.log(chalk.green(`\bSuccessfully removed guild ${!name ? guildId : name} in ${endTime / 1000} seconds.`));
    } catch (err) {
        spinner.fail(`Failed to remove guild ${!name ? guildId : name}! Error:\n${err}`);
        
        // End time
        let endTime = new Date() - startTime;
        
        console.log(chalk.red(`Failed. Took ${endTime / 1000} seconds.`));
    }
}

async function removeSelectedGuilds(token, guildIds) {
    // Start time
    let startTime = new Date();

    // Update 
    console.log(chalk.green(`\nStarting to remove ${guildIds.length} guilds.`));

    // Loop through the guildIds
    for (let i = 0; i < guildIds.length; i++) {
        // Only delete 1 per 200ms
        await new Promise(resolve => setTimeout(resolve, 200));

        let url = guildTemplateUrl.replace('{guildId}', guildIds[i]);
        let currentGuildName = await getGuildName(guildIds[i], token);

        
        // Remove the guild
        try {
            req = await axios.delete(url, {
                headers: {
                    Authorization: `${token}`
                }
            });
           console.log(chalk.bgGreen(`${chalk.black(!req.status ? "OK" : req.status)}`) + " | " + chalk.green(`Removed guild ${!currentGuildName ? guildIds[i] : currentGuildName} successfully!`));
        } catch (err) {
            console.log(chalk.bgRed(`${!err.response ? "Error" : err.response.status}`) + ` | ` + chalk.red(`Failed to remove guildID ${!currentGuildName ? guildIds[i] : currentGuildName}`));
            console.log(err)
        }
    }

    // End time
    let endTime = new Date() - startTime;

    spinner.succeed(`Processed ${guildIds.length} guilds in ${endTime / 1000} seconds.`);
}

module.exports = {
    removeAllGuilds,
    removeOneGuild,
    removeSelectedGuilds
}