////////////////////////////////////////////////////////////////////////////////
const accessToken = process.env.SPARK_TOKEN
const request = require("request");
////////////////////////////////////////////////////////////////////////////////

const options = {
    method: 'GET',
    url: 'https://api.ciscospark.com/v1/rooms',
    qs: { sortBy: 'id' },
    headers:
    {
        authorization: 'Bearer ' + accessToken
    }
};

function ciscoSparkGetRoomTitle(id, callback) {
    request(options, function (error, response, body) {
        if (error) {
            let errMsg = `FAILURE: Tried to get the Cisco Spark room title for id ${id} and got an error message - ` + error;
            callback(errMsg);
        } else if (response.statusCode !== 200) {
            let errMsg = `FAILURE: Tried to get the Cisco Spark room title for id ${id} and got an error HTML status code - ` + response.statusCode;
            callback(errMsg);
        } else {
            let myBody = JSON.parse(body);
            myBody.items.forEach(function (items) {
                if (items.id == id) {
                    callback(null, items.title);
                }
            });
        }
    });
}
module.exports.ciscoSparkGetRoomTitle = ciscoSparkGetRoomTitle;
////////////////////////////////////////////////////////////////////////////////
