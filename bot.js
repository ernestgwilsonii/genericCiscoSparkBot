////////////////////////////////////////////////////////////////////////////////
const ensureConfig = function () {
    if (!process.env.SPARK_TOKEN) {
        throw new Error("Error: SPARK_TOKEN environment variable is not set");
    }
};
ensureConfig();
////////////////////////////////////////////////////////////////////////////////
const accessToken = process.env.SPARK_TOKEN;
const PORT = process.env.PORT || 3000;
const { chatOpsLogger } = require('./lib/chatOpsLogger.js');
const { ciscoSparkGetPersonDetails } = require('./lib/ciscoSparkGetPersonDetails.js');
const moment = require('moment-timezone');
const sparkWebSocket = require('ciscospark-websocket-events');
const webHookUrl = "http://localhost:" + PORT + "/ciscospark/receive";

sparkwebsocket = new sparkWebSocket(accessToken)
sparkwebsocket.connect(function (err, res) {
    if (!err) {
        if (webHookUrl)
            sparkwebsocket.setWebHookURL(webHookUrl)
    }
    else {
        let currentTime = +moment.utc();
        let logLevel = 'CRITICAL';
        let logMsg = "{\"logChatOps\": {\"logTimestamp\": \"" + currentTime + "\", \"logLevel\": \"" + logLevel + "\", \"logError\": \"" + err + "\"}} ";
        console.log(logMsg);
    }
})

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
// hello //
///////////
controller.hears(['hello', 'greetings', 'hi'], 'direct_message,direct_mention', function (bot, message) {
    const { chatOps_hello } = require('./chatOps_hello.js');
    chatOps_hello(bot, message);
});
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// ping TARGET //
/////////////////
controller.hears('ping', 'direct_message,direct_mention', function (bot, message) {
    const { chatOps_ping } = require('./chatOps_ping.js');
    chatOps_ping(bot, message);
});
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// zipcode lookuup //
/////////////////////
controller.hears(['zipcode lookup', 'zip lookup'], 'direct_message,direct_mention', function (bot, message) {
    const { chatOps_zipCode_LookUp } = require('./chatOps_zipCode_LookUp.js');
    chatOps_zipCode_LookUp(bot, message);
});
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// BOT HELP SECTION //
//////////////////////
// Catch "all" HELP function  - For "help" or anything unknown sent to the bot!
controller.on('direct_message,direct_mention', function (bot, message) {
    const { sparkBotHelpDirectMention, sparkBotHelpDirectMessage } = require('./botHelp.js');
    const allArguments = message.text.replace(/\s+/g, " ");
    const Arg = allArguments.split(" ");
    let sparkMessage = [];
    message.command = "help"; // <--Set this value for acurate logging and reporting 
    ciscoSparkGetPersonDetails(message, function (error, person) {
        if (error) {
            message.logLevel = 'ERROR';
            let thisReply = "Bummer... \n\n" + error;
            sparkMessage.push(thisReply);
            bot.reply(message, sparkMessage.join(''));
        } else if (message.raw_message.data.roomType == 'group') {
            if (Arg[0].toUpperCase() !== "HELP") {
                message.logLevel = 'WARNING';
            }
            let thisReply = "Hello " + person.firstName + "!\n\n";
            sparkMessage.push(thisReply);
            sparkMessage.push(sparkBotHelpDirectMention); // Send help message formatted for a group space
            bot.reply(message, sparkMessage.join(''));
        } else if (message.raw_message.data.roomType == 'direct') {
            if (Arg[0].toUpperCase() !== "HELP") {
                message.logLevel = 'WARNING';
            }
            let thisReply = "Hello " + person.firstName + "!\n\n";
            sparkMessage.push(thisReply);
            sparkMessage.push(sparkBotHelpDirectMessage); // Send help message formatted for a private message
            bot.reply(message, sparkMessage.join(''));
        }
        chatOpsLogger(message, sparkMessage.join(''));
    });
});
////////////////////////////////////////////////////////////////////////////////
