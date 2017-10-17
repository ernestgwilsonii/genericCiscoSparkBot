////////////////////////////////////////////////////////////////////////////////
const accessToken = process.env.SPARK_TOKEN
const request = require("request");
////////////////////////////////////////////////////////////////////////////////

function ciscoSparkGetPersonDetails(message, callback) {

    let options = {
        method: 'GET',
        url: 'https://api.ciscospark.com/v1/people/' + message.raw_message.data.personId,
        headers:
        {
            authorization: 'Bearer ' + accessToken
        }
    };

    request(options, function (error, response, body) {
        if (error) {
            let errMsg = `FAILURE: Tried to get the Cisco Spark person details for id ${message.raw_message.data.personId} and got an error message - ` + error;
            callback(errMsg);
        } else if (response.statusCode !== 200) {
            let errMsg = `FAILURE: Tried to get the Cisco Spark person for id ${message.raw_message.data.personId} and got an error HTML status code - ` + response.statusCode;
            callback(errMsg);
        } else {
            let person = JSON.parse(body);
            callback(null, person);
        }
    });
}
module.exports.ciscoSparkGetPersonDetails = ciscoSparkGetPersonDetails;
////////////////////////////////////////////////////////////////////////////////
