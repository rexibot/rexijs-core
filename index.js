// const Path = require('path');

module.exports = {
  register({rootConfig}){
    global.App = global.App || {rootConfig};
    global.App.config = require('./reader/config');
    global.App.middleware = () => require('./reader/middleware');
    global.App.helpers = () => require('./reader/helper');
  },
  
  boot({app}) {}
};
