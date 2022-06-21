const request = require('request-promise-native');

const fetchMyIP = function(){
  return request('https://api.ipify.org?format=json')
};

const fetchCoordsByIP = function(body){
  const IP = JSON.parse(body).ip;
  return request (`https://api.ipbase.com/v2/info?apikey=sutsAwBbpAxjUcOCRRUWbFa9K2CfSBzLcjUIpsXH&ip=${IP}`)
};

const fetchISSFlyOverTimes = function(body){
  const latitude = JSON.parse(body).data.location.latitude
  const longitude = JSON.parse(body).data.location.longitude
  const url = `http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`
  return request(url);
};

const nextISSTimesFromMyLocation = function(){
  return fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then((data) => {
    const {response} = JSON.parse(data);
    return response
  });
}

//module.exports = {fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes}
module.exports = nextISSTimesFromMyLocation;