////////////////////////////////////////////////////////////////////////////////
const accessToken = process.env.SPARK_TOKEN;
const { chatOpsLogger } = require('./lib/chatOpsLogger.js');
const { zipCodeLookup } = require('./lib/zipCodeLookup.js');
const { ciscoSparkGetPersonDetails } = require('./lib/ciscoSparkGetPersonDetails.js');
const moment = require('moment-timezone');
const chatDebug = false;
////////////////////////////////////////////////////////////////////////////////

function chatOps_zipCode_LookUp(bot, message) {

    message.command = "zipcode lookuup"; // <--Set this value for acurate logging and reporting!

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
        message.logLevel = "WARN";
        let thisWarning = 'Sorry, **' + message.command + '** requires exactly **two** values! Please try using my help if you keep getting this message. [Looking for Country Codes? Click here!](http://zippopotam.us/#where)';
        bot.reply(message, thisWarning);
        return;
    }
    // REGEX Validation
    let thisValue1 = Arg[2];
    let re1 = /\w/; // regex
    let detector1 = thisValue1.match(re1);
    if (!detector1) {
        message.logLevel = "WARN";
        let thisWarning = 'Sorry, **' + message.command + '** requires **valid** values! Please try using my help if you keep getting this message. [Looking for Country Codes? Click here!](http://zippopotam.us/#where)'
        sparkMessage.push(thisWarning);
        bot.reply(message, sparkMessage.join(''));
        chatOpsLogger(message, sparkMessage.join(''));
        return;
    };
    let thisValue2 = Arg[3];
    let re2 = /\w/; // regex
    let detector2 = thisValue1.match(re2);
    if (!detector2) {
        message.logLevel = "WARN";
        let thisWarning = 'Sorry, **' + message.command + '** requires **valid** values! Please try using my help if you keep getting this message...'
        sparkMessage.push(thisWarning);
        bot.reply(message, sparkMessage.join(''));
        chatOpsLogger(message, sparkMessage.join(''));
        return;
    };
    botAck = "Just a moment please while I perform a **" + message.command + "** for **" + Arg[2] + " " + Arg[3] + "**";
    bot.reply(message, botAck);

    // Do the needful!
    ciscoSparkGetPersonDetails(message, function (error, person) {
        if (error) {
            message.logLevel = "ERROR";
            let thisReply = "Bummer... " + error;
            sparkMessage.push(thisReply);
            bot.reply(message, sparkMessage.join(''));
            chatOpsLogger(message, sparkMessage.join(''));
        } else {
            zipCodeLookup(Arg[2], Arg[3], function (error, results) {
                if (error) {
                    message.logLevel = "ERROR";
                    let thisReply = "Bummer... " + error;
                    sparkMessage.push(thisReply);
                    bot.reply(message, sparkMessage.join(''));
                    chatOpsLogger(message, sparkMessage.join(''));
                } else {
                    sparkMessage.push("\n" + horizontalLine);
                    if (results == "404") {
                        message.logLevel = "WARN";
                        let thisReply = "Hi " + person.firstName + ", here are the results of that zipcode lookup:\n\n**" + Arg[2] + "** could not be found, sorry!";
                        sparkMessage.push(thisReply);
                    } else {
                        let zipCountry = results.country;
                        let zipPlace = results.places[0]['place name'];
                        let zipState = results.places[0]['state'];
                        let zipPostCode = results['post code'];
                        let zipLatitude = results.places[0]['latitude'];
                        let zipLongitude = results.places[0]['longitude'];
                        let thisReply = "Hi " + person.firstName + ", here are the results of that zipcode lookup:\n\n**" + zipPostCode + "**\n\n[" + zipPlace + " " + zipState + " " + zipPostCode + " " + zipCountry + "](http://www.google.com/maps/place/" + zipLatitude + "," + zipLongitude + ")";
                        sparkMessage.push(thisReply);
                    }
                    sparkMessage.push("\n" + horizontalLineClose);
                    bot.reply(message, sparkMessage.join(''));
                    chatOpsLogger(message, sparkMessage.join(''));
                }
            })
        }
    });
}
module.exports.chatOps_zipCode_LookUp = chatOps_zipCode_LookUp;
////////////////////////////////////////////////////////////////////////////////
