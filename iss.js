/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');

const fetchMyIP = (callback) => {
  // let myIP;
  request('https://api64.ipify.org/?format=json', function(error, response, body) {

    if (error) return callback(error,null);

    if (response.statusCode !== 200) {
      const msg = `Status code ${response.statusCode} when fetching IP. Response ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    const ip = JSON.parse(body).ip;
    //console.log(ip)
    callback(null, ip);
    // console.log('myIP2: ', myIP)
    
    
  });
  
};

const fetchCoordsByIP = function (ip, callback){

  request(`https://api.ipbase.com/v2/info?apikey=sutsAwBbpAxjUcOCRRUWbFa9K2CfSBzLcjUIpsXH&ip=${ip}`, function(error, response, body){
  if (error){
    callback(error,null);
    return;
  }

  if (response.statusCode !== 200) {
    const msg = `Status code ${response.statusCode} when fetching IP. Response ${body}`;
    callback(Error(msg), null);
    return;
  }

  const {latitude, longitude} = JSON.parse(body);
  callback(null, {latitude, longitude})
  
});
};

const fetchISSFlyoverTimes = function(coords, callback){
  request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`,function(error, response, body){;

  if(error){
    callback(error,null);
    return;
  }

  if (response.statusCode !== 200) {
    const msg = `Status code ${response.statusCode} when fetching IP. Response ${body}`;
    callback(Error(msg), null);
    return;
  }

  const passes = JSON.parse(body).response;
  callback(null,passes);
})
}

const nextISSTimesFromMyLocation = (callback) => {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyoverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
}



module.exports = {fetchMyIP, fetchCoordsByIP, fetchISSFlyoverTimes, nextISSTimesFromMyLocation};