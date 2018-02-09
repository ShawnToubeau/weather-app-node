const fs = require('fs');

var getDefault = () => {
  try {
    var defaultString = fs.readFileSync('default-address.json');
    return JSON.parse(defaultString);
  } catch (e) {
    return [];
  }
};

var setDefault = (address) => {
  var defaultAddress = getDefault();
  defaultAddress=address;
  fs.writeFileSync('default-address.json', JSON.stringify(address));
}

module.exports = {
  getDefault,
  setDefault
};
