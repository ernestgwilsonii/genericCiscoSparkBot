////////////////////////////////////////////////////////////////////////////////
const accessToken = process.env.SPARK_TOKEN
const { chatOpsLogger } = require('./chatOpsLogger.js');
const { ciscoSparkGetBotInfo } = require('./ciscoSparkGetBotInfo.js');
const { ciscoSparkGetPersonDetails } = require('./ciscoSparkGetPersonDetails.js');
const chatDebug = false;
////////////////////////////////////////////////////////////////////////////////

function ciscoSparkVerifyOrgSecurity(bot, message, callback) {

    message.command = "ciscoSparkVerifyOrgSecurity function"; // <--Set this value for acurate logging and reporting!

    let sparkMessage = []; // Initialize a clean message to start

    ciscoSparkGetPersonDetails(message, function (error, person) {
        if (error) {
            message.logLevel = "ERROR";
            let errMsg = "Bummer... Spark failed to get person details during security verification: " + error;
            sparkMessage.push(errMsg);
            bot.reply(message, sparkMessage.join(''));
            chatOpsLogger(message, sparkMessage.join(''));
            callback(errMsg);
        } else {
            if (chatDebug === true) { console.log('person.orgId: ' + person.orgId); }
            ciscoSparkGetBotInfo(message, function (error, botInfo) {
                if (error) {
                    message.logLevel = "ERROR";
                    let errMsg = "Bummer... Spark failed to get bot info during security verification: " + error;
                    sparkMessage.push(errMsg);
                    bot.reply(message, sparkMessage.join(''));
                    chatOpsLogger(message, sparkMessage.join(''));
                    callback(errMsg);
                } else {
                    if (chatDebug === true) { console.log('botInfo.orgId: ' + botInfo.orgId); }
                    if (botInfo.orgId !== person.orgId) {
                        message.logLevel = "WARNING";
                        let errMsg = 'ACCESS DENIED: Security protocol enforced - Only members of the organization can interact with this bot!';
                        sparkMessage.push(errMsg);
                        bot.reply(message, sparkMessage.join(''));
                        chatOpsLogger(message, sparkMessage.join(''));
                        callback(errMsg);
                    } else {
                        callback(null); // No security issue detected at this point, the bot's orgId matches the human's orgId
                    }
                }
            });
        }
    });

}
module.exports.ciscoSparkVerifyOrgSecurity = ciscoSparkVerifyOrgSecurity;
////////////////////////////////////////////////////////////////////////////////
