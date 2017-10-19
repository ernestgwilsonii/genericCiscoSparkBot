////////////////////////////////////////////////////////////////////////////////
const moment = require('moment-timezone');
const { ciscoSparkGetRoomTitle } = require('./ciscoSparkGetRoomTitle.js');
const { ciscoSparkGetMyOwnDetails } = require('./ciscoSparkGetMyOwnDetails.js');
////////////////////////////////////////////////////////////////////////////////

function chatOpsLogger(message, response) {
    let myId = message.channel;
    let logLevel = message.logLevel;
    let currentTime = +moment.utc(); // Get current time
    ciscoSparkGetRoomTitle(myId, function (error, title) {
        if (error) {
            let logLevel = 'ERROR';
            let logMsg = "{\"chatOps\": {\"chatTimestamp\": \"" + currentTime + "\", \"chatLevel\": \"" + logLevel + "\", \"chatError\": \"" + error + "\", \"chatDump\": \"" + message + "\"}} ";
            console.log(logMsg);
        } else {
            ciscoSparkGetMyOwnDetails(myId, function (error, botName) {
                if (error) {
                    let logLevel = 'ERROR';
                    let logMsg = "{\"chatOps\": {\"chatTimestamp\": \"" + currentTime + "\", \"chatLevel\": \"" + logLevel + "\", \"chatError\": \"" + error + "\", \"chatDump\": \"" + message + "\"}} ";
                    console.log(logMsg);
                } else {
                    message.logLevel = message.logLevel || "INFORMATIONAL"; // Default (if undefined) logging level value is "INFO" unless specifically set in message.logLevel
                    let logMsg = "{\"chatOps\": {\"chatTimestamp\": \"" + currentTime + "\", \"chatLevel\": \"" + message.logLevel + "\", \"chatBot\": \"" + botName + "\", \"chatCommand\": \"" + message.command + "\", \"chatUser\": \"" + message.user + "\", \"chatType\": \"" + message.raw_message.data.roomType + "\", \"chatSpace\": \"" + title + "\", \"chatRequest\": \"" + message.text + "\", \"chatResponse\": \"" + response + "\"}} ";
                    console.log(logMsg);
                }
            });
        }
    });
}
module.exports.chatOpsLogger = chatOpsLogger;
////////////////////////////////////////////////////////////////////////////////
