////////////////////////////////////////////////////////////////////////////////
// ChatOps for Cisco Spark based on Botkit
////////////////////////////////////////////////////////////////////////////////
/// Setup the Cisco Spark Websocket
// https://www.npmjs.com/package/ciscospark-websocket-events
// https://github.com/howdyai/botkit/blob/master/docs/readme-ciscospark.md
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// No point in launching if we are missing the required environment variables //
////////////////////////////////////////////////////////////////////////////////
var ensureConfig = function () {
    if (!process.env.SPARK_TOKEN) {
        throw new Error("Error: SPARK_TOKEN environment variable is not set");
    }
};
ensureConfig();

const accessToken = process.env.SPARK_TOKEN;
const { chatOpsLogger } = require('./lib/chatOpsLogger.js');
const { ciscoSparkGetPersonDetails } = require('./lib/ciscoSparkGetPersonDetails.js');
const moment = require('moment-timezone');
const sparkWebSocket = require('ciscospark-websocket-events')

const chatDebug = false;
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
const PORT = process.env.PORT || 3000;
const webHookUrl = "http://localhost:" + PORT + "/ciscospark/receive";

sparkwebsocket = new sparkWebSocket(accessToken)
sparkwebsocket.connect(function (err, res) {
    if (!err) {
        if (webHookUrl)
            sparkwebsocket.setWebHookURL(webHookUrl)
    }
    else {
        let currentTime = +moment.utc(); // Get current time
        let logLevel = 'CRITICAL';
        let logMsg = "{\"logChatOps\": {\"logTimestamp\": \"" + currentTime + "\", \"logLevel\": \"" + logLevel + "\", \"logError\": \"" + err + "\"}} ";
        console.log(logMsg);
    }
})

//////////////
// Bot Kit //
/////////////

const Botkit = require('botkit');
const controller = Botkit.sparkbot({
    debug: false,
    log: true,
    public_address: "https://localhost",
    ciscospark_access_token: accessToken
});

const bot = controller.spawn({});
controller.setupWebserver(PORT, function (err, webserver) {
    // Setup incoming webhook handler 
    webserver.post('/ciscospark/receive', function (req, res) {
        res.sendStatus(200)
        controller.handleWebhookPayload(req, res, bot);
    });
});
////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////
// EXAMPLE: Hello //
////////////////////
// Example of an "OR" for "hears" and all possible fields we can act on
// Try two direct messages (note case InSeNsItIvE match on the "hears" array) and say: 
// Hello two three four five six
// or
// gReeTINGs two three four five six
controller.hears(['hello', 'greetings', 'hi'], 'direct_message,direct_mention', function (bot, message) {

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
    var allArguments = message.text.replace(/\s+/g, " ");
    var Arg = allArguments.split(" ");
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
});
////////////////////////////////////////////////////////////////////////////////





////////////////////////////////////////////////////////////////////////////////
// BOT HELP SECTION //
//////////////////////

// DIRECT MENTION HELP (GROUP SPACE) //
const sparkBotHelpDirectMention = "Here are the things that I know how to do via **@direct mention** when you chat with me in a **group** space: \n\n \
``` \n \
@YourBotsName help                       <-- Displays this help message\n \
Hint: To command a bot in a channel, you need to direct mention the bot's name so it turns blue. \n \
``` \n";

// DIRECT MESSAGE HELP (PRIVATE MESSAGE) //
const sparkBotHelpDirectMessage = "Here are the things that I know how to do via **direct message** when you chat with me privately: \n\n \
``` \n \
help \n \
``` \n";

////////////////////////////
// Catch "all" HELP function  - For "help" or anything unknown sent to the bot!
controller.on('direct_message,direct_mention', function (bot, message) {
    let sparkMessage = [];
    message.command = "help"; // Set this value for acurate logging and reporting 
    ciscoSparkGetPersonDetails(message, function (error, person) {
        if (error) {
            message.logLevel = 'ERROR';
            let thisReply = "Bummer... \n\n" + error;
            sparkMessage.push(thisReply);
            bot.reply(message, sparkMessage.join(''));
        } else if (message.raw_message.data.roomType == 'group') {
            let thisReply = "Hello " + person.firstName + "!\n\n";
            sparkMessage.push(thisReply);
            sparkMessage.push(sparkBotHelpDirectMention); // Send help message formatted for a group space
            bot.reply(message, sparkMessage.join(''));
        } else if (message.raw_message.data.roomType == 'direct') {
            let thisReply = "Hello " + person.firstName + "!\n\n";
            sparkMessage.push(thisReply);
            sparkMessage.push(sparkBotHelpDirectMessage); // Send help message formatted for a private message
            bot.reply(message, sparkMessage.join(''));
        }
        chatOpsLogger(message, sparkMessage.join(''));
    });
});
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
