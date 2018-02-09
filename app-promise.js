  const yargs = require('yargs');
  const axios = require('axios');

  const defaultAddress = require('./default-address.js');

  var stringAddress;

  const argv = yargs
    .options({
      a: {
        demand: false,
        alias: 'address',
        describe: 'Address to fetch weather for',
        string: true
      },
      da: {
        demand: false,
        alias: 'defaultAddress',
        describe: 'Default address to fetch weather for',
        string: true
      }
    })
    .help()
    .alias('help', 'h')
    .argv;

  if (argv.da != undefined) {

    console.log("Setting default address");
    defaultAddress.setDefault(argv.da);
  }

  if (argv.a == undefined) {

    console.log('No address entered. Checking for default address..');
    if (defaultAddress.getDefault().length > 0) {

      console.log('Got default address: ' + defaultAddress.getDefault());
      stringAddress = defaultAddress.getDefault();
    } else {

      console.log('No default address found')
    }
  } else {

    console.log('Address entered');
    stringAddress = argv.a;
  }

  var encodedAddress = encodeURIComponent(stringAddress);
  var geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`

  axios.get(geocodeURL).then((response) => {
    if (response.data.status === 'ZERO_RESULTS') {
      throw new Error('Unable to find that address.');
    }
    var lat = response.data.results[0].geometry.location.lat;
    var long = response.data.results[0].geometry.location.lng;
    var weatherURL = `https://api.darksky.net/forecast/866d02247b135a5df4d9493c83c9820a/${lat},${long}`;
    console.log(response.data.results[0].formatted_address);
    return axios.get(weatherURL)
  }).then((response) => {
    var temperature = response.data.currently.temperature;
    var apparentTemperature = response.data.currently.apparentTemperature;
    console.log(`It is currently ${temperature}. It feels like ${apparentTemperature}.`);
  }).catch((e) => {
    if (e.code === 'ENOTFOUND') {
      console.log('Unable to connect to API servers');
    } else {
      console.log(e.message);
    }
  });
