const fs = require('fs');
const path = require('path');
const basename = path.dirname(require.main.filename);
let handlers = {};
const{modules} = App.options;

function addHandlers(dir, file){
  let item = require(path.join(dir, file));
  let name = item.name || path.parse(file).name;
  handlers[name] = item.handle;
}

modules.forEach((el) => {
  let root = null;

  // Check if have not start @
  if (el.charAt(0) !== '@') root = [basename, 'src', el, 'middleware'].join(path.sep);
  else root = [basename, 'node_modules', el.replace(/^@/, ''), 'middleware'].join(path.sep);

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
