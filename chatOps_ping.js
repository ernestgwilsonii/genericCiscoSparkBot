////////////////////////////////////////////////////////////////////////////////
const accessToken = process.env.SPARK_TOKEN;
const exec = require("child_process").exec;
const { chatOpsLogger } = require('./lib/chatOpsLogger.js');
const { ciscoSparkGetPersonDetails } = require('./lib/ciscoSparkGetPersonDetails.js');
const moment = require('moment-timezone');
const chatDebug = false;
////////////////////////////////////////////////////////////////////////////////

function chatOps_ping(bot, message) {

    message.command = "ping"; // <--Set this value for acurate logging and reporting!

    let sparkMessage = []; // Initialize a clean message to start
    const horizontalLine = "---\n";
    const horizontalLineClose = "\n---\n";
    const codeBlockMarkDown = "```\n";

    // Read the human's input
    const AllArguments = message.text.replace(/\s+/g, " ");
    const Arg = AllArguments.split(" ");
    // Argument debugging
    if (chatDebug === true) { console.log("AllArguments: " + AllArguments); } // See value of AllArguments
    if (chatDebug === true) { console.log("Arg[0]: " + Arg[0]); } // See value of Arg[0]
    if (chatDebug === true) { console.log("Arg[1]: " + Arg[1]); } // See value of Arg[1]
    if (chatDebug === true) { console.log("Arg[2]: " + Arg[2]); } // See value of Arg[2]
    // Bot responds to human:
    if (Arg[1] == undefined | Arg[2] !== undefined) {
        // Bad human! This command requires exactly one argument!
        message.logLevel = "WARNING";
        let thisWarning = 'Sorry, **' + message.command + '** requires exactly **one** target! Please try using my help if you keep getting this message.';
        sparkMessage.push(thisWarning);
        bot.reply(message, sparkMessage.join(''));
        chatOpsLogger(message, sparkMessage.join(''));
        return;
    }
    // REGEX Validator
    let target = Arg[1];
    let re = /[\;\$\&\|\?\<\>\!\@\#\%\^\(\)\'\"\:\~\`\+\{\}\[\]']/; // Use regex to look for unsafe characters
    let detector = target.match(re);
    if (detector) {
        message.logLevel = "WARNING";
        let thisWarning = 'Sorry, **' + message.command + '** requires **valid** characters in the target! Please try using my help if you keep getting this message.';
        sparkMessage.push(thisWarning);
        bot.reply(message, sparkMessage.join(''));
        chatOpsLogger(message, sparkMessage.join(''));
        return;
    };
    botAck = "Just a moment please while I ping " + Arg[1];
    bot.reply(message, botAck);

    // Prepare to execute a native OS command
    let execThisCommand = "";
    let linPingCommand = "ping -D -O -b -c 10 " + target; // Use this command on Linux
    let winPingCommand = "ping -n 10 " + target; // Use this command on Windows
    // OS detection
    let detectedPlatform = process.platform; // Possible values are 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
    if (detectedPlatform == "win32") {
        if (chatDebug === true) { console.log("win32"); } // Windows
        execThisCommand = winPingCommand;
    } else if (detectedPlatform == "linux") {
        if (chatDebug === true) { console.log("linux"); } // Linux
        execThisCommand = linPingCommand;
    } else {
        // OS not supported
        message.logLevel = "CRITICAL";
        sparkMessage.push("\n" + horizontalLine);
        sparkMessage.push("\n" + codeBlockMarkDown);
        sparkMessage.push("FAIL: This bot is currently running on an unsupported platform.");
        sparkMessage.push("CRITICAL: OS not supported: " + detectedPlatform);
        sparkMessage.push("\n" + codeBlockMarkDown);
        sparkMessage.push("\n" + horizontalLineClose);
        bot.reply(message, sparkMessage.join(''));
        chatOpsLogger(message, sparkMessage.join(''));
        return;
    }

    // Perform the command via child process exec
    exec(execThisCommand, function (error, stdout, stderr) {
        if (error) {
            if (chatDebug === true) { console.log(sparkMessage.join('')); }
            message.logLevel = "CRITICAL";
            sparkMessage.push("\n" + horizontalLine);
            sparkMessage.push("\n" + codeBlockMarkDown);
            sparkMessage.push(error);
            sparkMessage.push("\n" + codeBlockMarkDown);
            sparkMessage.push("\n" + horizontalLineClose);
            bot.reply(message, sparkMessage.join(''));
            chatOpsLogger(message, sparkMessage.join(''));
            return;
        }
        if (stderr) {
            if (chatDebug === true) { console.log(sparkMessage.join('')); }
            message.logLevel = "WARNING";
            sparkMessage.push("\n" + horizontalLine);
            sparkMessage.push("\n" + codeBlockMarkDown);
            sparkMessage.push(stderr);
            sparkMessage.push("\n" + codeBlockMarkDown);
            sparkMessage.push("\n" + horizontalLineClose);
            bot.reply(message, sparkMessage.join(''));
            chatOpsLogger(message, sparkMessage.join(''));
            return;
        }
        let results = stdout;
        sparkMessage.push("\n" + horizontalLine);
        sparkMessage.push("\n" + codeBlockMarkDown);
        sparkMessage.push(results);
        sparkMessage.push("\n" + codeBlockMarkDown);
        sparkMessage.push("\n" + horizontalLineClose);
        bot.reply(message, sparkMessage.join(''));
        chatOpsLogger(message, sparkMessage.join(''));
    });
}
module.exports.chatOps_ping = chatOps_ping;
////////////////////////////////////////////////////////////////////////////////
