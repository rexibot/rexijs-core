const fs = require('fs');
const path = require('path');
const basename = path.dirname(require.main.filename);
let handlers = {};
const{modules} = App.options;
let actions = {};

function addHandlers(dir, file){
  let item = require(path.join(dir, file));
  let name = item.name || path.parse(file).name;
  let aKey = item.group + '___' + name;

  actions[aKey] = actions[aKey] || [];
  handlers[item.group] = handlers[item.group] || {};
  handlers[item.group][name] = handlers[item.group][name] || (function(n){
    return async function(d){
      let state = {};

      for (let i = 0; i < actions[n].length; i++) {
        state = await actions[n][i](state, d);
      }

      return state;
    };
  })(aKey);
  
  if (item.replace) actions[aKey] = [item.handle];
  else actions[aKey].push(item.handle);
}

modules.forEach((el) => {
  let root = null;

  // Check if have #
  if (el.charAt(0) === '#') root = [basename, 'src', el.replace(/^#/, '') , 'helpers'].join(path.sep);
  else root = [basename, 'node_modules', el, 'helpers'].join(path.sep);

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
