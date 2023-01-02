const fs = require('fs');
const path = require('path');
let handlers = {};
const{modules} = App.options;

function addHandlers(dir, file){
  let item = require(path.join(dir, file));
  let name = item.name || path.parse(file).name;
  handlers[name] = item.handle;
}

modules.forEach((el) => {
  let root = __modulePath(el, 'middleware');

  if (fs.existsSync(root)) {
    fs
    .readdirSync(root)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
      addHandlers(root, file);
    });
  }
});

module.exports = handlers;
