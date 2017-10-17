////////////////////////////////////////////////////////////////////////////////
const accessToken = process.env.SPARK_TOKEN;
const moment = require('moment-timezone');
const { chatOpsLogger } = require('./lib/chatOpsLogger.js');
const { ciscoSparkGetPersonDetails } = require('./lib/ciscoSparkGetPersonDetails.js');
const chatDebug = false;
////////////////////////////////////////////////////////////////////////////////

function chatOps_hello(bot, message) {

    message.command = "hello"; // <--Set this value for acurate logging and reporting!

    let sparkMessage = []; // Initialize a clean message to start

    if (chatDebug === true) { console.log("message: " + JSON.stringify(message)); }
    if (chatDebug === true) { console.log("message.user: " + JSON.stringify(message.user)); }
    if (chatDebug === true) { console.log("message.channel: " + JSON.stringify(message.channel)); }
    if (chatDebug === true) { console.log("message.text: " + JSON.stringify(message.text)); }
    if (chatDebug === true) { console.log("message.id: " + JSON.stringify(message.id)); }
    if (chatDebug === true) { console.log("message.type: " + JSON.stringify(message.type)); }
    if (chatDebug === true) { console.log("message.match: " + JSON.stringify(message.match)); }
    if (chatDebug === true) { console.log("message.raw_message.event: " + JSON.stringify(message.raw_message.event)); }
    if (chatDebug === true) { console.log("message.raw_message.resource: " + JSON.stringify(message.raw_message.resource)); }
    if (chatDebug === true) { console.log("message.raw_message.data: " + JSON.stringify(message.raw_message.data)); }
    if (chatDebug === true) { console.log("message.raw_message.data.id: " + JSON.stringify(message.raw_message.data.id)); }
    if (chatDebug === true) { console.log("message.raw_message.data.roomId: " + JSON.stringify(message.raw_message.data.roomId)); }
    if (chatDebug === true) { console.log("message.raw_message.data.roomType: " + JSON.stringify(message.raw_message.data.roomType)); }
    if (chatDebug === true) { console.log("message.raw_message.data.text: " + JSON.stringify(message.raw_message.data.text)); }
    if (chatDebug === true) { console.log("message.raw_message.data.personId: " + JSON.stringify(message.raw_message.data.personId)); }
    if (chatDebug === true) { console.log("message.raw_message.data.personEmail: " + JSON.stringify(message.raw_message.data.personEmail)); }
    if (chatDebug === true) { console.log("message.raw_message.data.created: " + JSON.stringify(message.raw_message.data.created)); }
    if (chatDebug === true) { console.log("message._pipeline.stage: " + JSON.stringify(message._pipeline.stage)); }

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
    if (chatDebug === true) { console.log("Arg[5]: " + Arg[5]); } // See value of Arg[5]
    if (chatDebug === true) { console.log("Arg[6]: " + Arg[6]); } // See value of Arg[6]

    // Bot responds to the human:
    ciscoSparkGetPersonDetails(message, function (error, person) {
        if (error) {
            message.logLevel = "ERROR";
            let thisReply = "Bummer... " + error;
            sparkMessage.push(thisReply);
            bot.reply(message, sparkMessage.join(''));
            chatOpsLogger(message, sparkMessage.join(''));
        } else {
            let thisReply = "Hi " + person.firstName;
            sparkMessage.push(thisReply);
            bot.reply(message, sparkMessage.join(''));
            chatOpsLogger(message, sparkMessage.join(''));
        }
    });
}
module.exports.chatOps_hello = chatOps_hello;
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// ChatOps for Cisco Spark based on Botkit
////////////////////////////////////////////////////////////////////////////////
/// Setup the Cisco Spark Websocket
// https://www.npmjs.com/package/ciscospark-websocket-events
// https://github.com/howdyai/botkit/blob/master/docs/readme-ciscospark.md
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Examples that came with the kit //
/////////////////////////////////////
// controller.on('direct_mention', function (bot, message) {
//     bot.reply(message, 'You mentioned me in a group space and said, "' + message.text + '"');
// });
// controller.on('direct_message', function (bot, message) {
//     bot.reply(message, 'I got your private message. You said, "' + message.text + '"');
// });
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Busted: "ambient" does not work with a bot's token in Cisco Spark
// REF: https://github.com/howdyai/botkit/issues/1060 //
////////////////////////////////////////////////////////
// controller.hears('boom', 'message_received,ambient', function (bot, message) {
//     bot.reply(message, 'Kaboom!');
// });
////////////////////////////////////////////////////////////////////////////////
