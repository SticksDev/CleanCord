// CLI Tools
const chalk = require('chalk');
const ora = require('ora');

// Framework
const framework = require('./framework');

// EULA Timer
const spinner = ora('Showing EULA (5)').start();

console.clear();
console.log(chalk.bgRed("Read ME:"), chalk.yellow("This tool is ment to HELP you with getting rid of discord servers/friends you don't talk to anymore.\nIN NO WAY is this ment for malicious purposes, nor should it be used for anything malicious. I'm just trying to make a tool to help people.\n\nThe program will start in 5 seconds.\n"));

let count = 5;

// Make a coutndown timer and update the spinner
let timer = setInterval(() => {
    count--;
    spinner.text = `Showing EULA (${count})`;
    if (count === 0) {
        clearInterval(timer);
        spinner.stop();
        framework.main();
    }
}, 1000);