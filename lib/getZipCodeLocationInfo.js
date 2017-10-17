////////////////////////////////////////////////////////////////////////////////
// In Node.js "node-fetch" - https://www.npmjs.com/package/node-fetch
// is like the "fetch API" in the browser - https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
const fetch = require("node-fetch");
////////////////////////////////////////////////////////////////////////////////

function getZipCodeLocationInfo(theCountry, theZip, callback) {

    fetch(`https://api.zippopotam.us/${theCountry}/${theZip}`)
        .then(response => {
            if (response.status !== 200 && response.status !== 404) {
                let errMsg = `HTML status code error ` + response.status;
                throw errMsg;
            } else {
                return response.json();
            }
        })
        .then(body => {
            if (body.places) {
                let myResults = body;
                callback(null, myResults);
            } else {
                let myResults = "404";
                callback(null, myResults);
            }
        })
        .catch(err => callback(err));
}
module.exports.getZipCodeLocationInfo = getZipCodeLocationInfo;
////////////////////////////////////////////////////////////////////////////////
