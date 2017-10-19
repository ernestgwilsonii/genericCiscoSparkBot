////////////////////////////////////////////////////////////////////////////////
const accessToken = process.env.SPARK_TOKEN;
const { chatOpsLogger } = require('./lib/chatOpsLogger.js');
const { ciscoSparkGetPersonDetails } = require('./lib/ciscoSparkGetPersonDetails.js');
const moment = require('moment-timezone');
const chatDebug = false;
////////////////////////////////////////////////////////////////////////////////

function chatOps_starterTemplate(bot, message) {

    message.command = "your command"; // <--Set this value for acurate logging and reporting!

    let sparkMessage = []; // Initialize a clean message to start
    const horizontalLine = "---\n";
    const horizontalLineClose = "\n---\n";

    // Read the human's input
    const allArguments = message.text.replace(/\s+/g, " ");
    const Arg = allArguments.split(" ");
    // Argument chatDebugging
    if (chatDebug === true) { console.log("AllArguments: " + allArguments); } // See value of allArguments
    if (chatDebug === true) { console.log("Arg[0]: " + Arg[0]); } // See value of Arg[0]
    if (chatDebug === true) { console.log("Arg[1]: " + Arg[1]); } // See value of Arg[1]
    if (chatDebug === true) { console.log("Arg[2]: " + Arg[2]); } // See value of Arg[2]
    if (chatDebug === true) { console.log("Arg[3]: " + Arg[3]); } // See value of Arg[3]
    if (chatDebug === true) { console.log("Arg[4]: " + Arg[4]); } // See value of Arg[4]
    // Bot responds to the human:
    if (Arg[2] == undefined | Arg[3] == undefined | Arg[4] !== undefined) {
        // Bad human! This command requires exactly two arguments!
        message.logLevel = "WARNING";
        let thisWarning = 'Sorry, **' + message.command + '** requires exactly **two** values! Please try using my help if you keep getting this message.';
        bot.reply(message, thisWarning);
        return;
    }
    // REGEX Validation
    let thisValue1 = Arg[2];
    let re1 = /\w/; // regex
    let detector1 = thisValue1.match(re1);
    if (!detector1) {
        message.logLevel = "WARNING";
        let thisWarning = 'Sorry, **' + message.command + '** requires **valid** values! Please try using my help if you keep getting this message.';
        sparkMessage.push(thisWarning);
        bot.reply(message, sparkMessage.join(''));
        chatOpsLogger(message, sparkMessage.join(''));
        return;
    };
    let thisValue2 = Arg[3];
    let re2 = /\w/; // regex
    let detector2 = thisValue1.match(re2);
    if (!detector2) {
        message.logLevel = "WARNING";
        let thisWarning = 'Sorry, **' + message.command + '** requires **valid** values! Please try using my help if you keep getting this message.';
        sparkMessage.push(thisWarning);
        bot.reply(message, sparkMessage.join(''));
        chatOpsLogger(message, sparkMessage.join(''));
        return;
    };
    botAck = "Just a moment please while I perform a **" + message.command + "** for **" + Arg[2] + " " + Arg[3] + "**";
    bot.reply(message, botAck);

    // Do the needful!

}
module.exports.chatOps_starterTemplate = chatOps_starterTemplate;
////////////////////////////////////////////////////////////////////////////////
