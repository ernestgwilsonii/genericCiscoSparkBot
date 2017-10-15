const request = require("request");
const accessToken = process.env.SPARK_TOKEN

function ciscoSparkGetMyOwnDetails(message, callback) {

    let options = {
        method: 'GET',
        url: 'https://api.ciscospark.com/v1/people/me',
        headers:
        {
           authorization: 'Bearer ' + accessToken
        }
    };

    request(options, function (error, response, body) {
        if (error) {
            let errMsg = `FAILURE: Tried to get the Cisco Spark bot's displayName and got an error message - ` + error;
            callback(errMsg);
        } else if (response.statusCode !== 200) {
            let errMsg = `FAILURE: Tried to get the Cisco Spark bot's displayName and got an error HTML status code - ` + response.statusCode;
            callback(errMsg);
        } else {
            let thisBot = JSON.parse(body);
            callback(null, thisBot.displayName);
        }
    });
}

module.exports.ciscoSparkGetMyOwnDetails = ciscoSparkGetMyOwnDetails;