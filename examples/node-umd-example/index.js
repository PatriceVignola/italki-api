const ItalkiAPI = require('../../dist/italki-api.min.js');

ItalkiAPI.fetchUser(1280555).then(user => {
  console.log(user);
});
