const moment = require('moment-timezone');
const { ciscoSparkGetRoomTitle } = require('./ciscoSparkGetRoomTitle.js');
const { ciscoSparkGetMyOwnDetails } = require('./ciscoSparkGetMyOwnDetails.js');

function chatOpsLogger(message, response) {
    let myId = message.channel;
    let logLevel = message.logLevel;
    let currentTime = +moment.utc(); // Get current time
    ciscoSparkGetRoomTitle(myId, function (error, title) {
        if (error) {
            let logLevel = 'ERROR';
            let logMsg = "{\"logChatOps\": {\"logTimestamp\": \"" + currentTime + "\", \"logLevel\": \"" + logLevel + "\", \"logError\": \"" + error + "\", \"logDump\": \"" + message + "\"}} ";
            console.log(logMsg);
        } else {
            ciscoSparkGetMyOwnDetails(myId, function (error, botName) {
                if (error) {
                    let logLevel = 'ERROR';
                    let logMsg = "{\"logChatOps\": {\"logTimestamp\": \"" + currentTime + "\", \"logLevel\": \"" + logLevel + "\", \"logError\": \"" + error + "\", \"logDump\": \"" + message + "\"}} ";
                    console.log(logMsg);
                } else {
                    message.logLevel = message.logLevel || "INFO"; // Default (if undefined) logging level value is "INFO" unless specifically set in message.logLevel
                    let logMsg = "{\"logChatOps\": {\"logTimestamp\": \"" + currentTime + "\", \"logLevel\": \"" + message.logLevel + "\", \"logBot\": \"" + botName + "\", \"logCommand\": \"" + message.command + "\", \"logUser\": \"" + message.user + "\", \"logType\": \"" + message.raw_message.data.roomType + "\", \"logSpace\": \"" + title + "\", \"logRequest\": \"" + message.text + "\", \"logResponse\": \"" + response + "\"}} ";
                    console.log(logMsg);
                }
            });
        }
    });
}

module.exports.chatOpsLogger = chatOpsLogger;