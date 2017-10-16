const request = require("request");
const { getZipCodeLocationInfo } = require('./getZipCodeLocationInfo.js');

function zipCodeLookup(myCountry, myZip, callback) {

    getZipCodeLocationInfo(myCountry, myZip, function (error, response) {
        if (error) {
            let errMsg = `FAILURE: Tried to zipcode lookup ${myZip} and got an error message - ` + error;
            callback(errMsg);
        } else {
            //let theResults = JSON.parse(response);
            callback(null, response);
        }
    });   
}

module.exports.zipCodeLookup = zipCodeLookup;