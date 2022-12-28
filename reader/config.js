const fs = require('fs');
const path = require('path');
const basename = path.dirname(require.main.filename);
let handlers = {};
const{modules} = App.options;

function addHandlers(dir, file){
  let configData = require(path.join(dir, file));
  // console.log('Hello',configData);
  let name = path.parse(file).name;
  handlers[name] = {
    ...(handlers[name] || {}),
    ...configData
  };
}

modules.forEach((el) => {
  let root = null;

  // Check if have not start @
  if (el.charAt(0) !== '@') root = [basename, 'src', el, 'config'].join(path.sep);
  else root = [basename, 'node_modules', el.replace(/^@/, ''), 'config'].join(path.sep);

  if (fs.existsSync(root)) {
    fs
    .readdirSync(root)
    .filter(file => {
      // console.log(root, file);
      return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
      // console.log(root, 'OK OK');
      addHandlers(root, file);
    });
  }
});

module.exports = handlers;
