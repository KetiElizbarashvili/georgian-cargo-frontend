function getCurrentURL() {
  return window.location.href;
}

const currentWebURL = getCurrentURL();

var bearer = "Bearer " + currentWebURL.split("#")[1];
// console.log(bearer);
// var domain = "https://api.georgiancargo.co.uk";
var domain = "http://localhost:443";



