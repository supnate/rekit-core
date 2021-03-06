const _ = require('lodash');

const getParentPlugin = () => rekit.core.plugin.getPlugin('rekit-react');
function processProjectData(prjData, args) {
  const pp = getParentPlugin();
  if (!pp) throw new Error('Plugin not found: rekit-react');
  pp.app.processProjectData(prjData, args);
  const { elements, elementById } = prjData;

  const { files, vio } = rekit.core;

  if (vio.dirExists('core')) {
    const id = 'v:_plugin-ext-core';
    const res = files.readDir('core');
    Object.assign(elementById, res.elementById);
    elementById[id] = {
      id,
      name: 'Ext Core',
      target: 'core',
      type: 'folder-alias',
      icon: 'core',
      children: res.elements,
    };
    _.pull(elements, 'core');
    elements.splice(1, 0, id);
  }

  if (elementById['src/ext']) {
    const id = 'v:_plugin-ext-ui';
    // For rekit plugin project, there's a ext virtual folder points to src/ext
    elementById[id] = {
      id,
      name: 'Ext UI',
      target: 'src/ext',
      type: 'folder-alias',
      icon: 'ui',
      iconColor: '#CDDC39',
      children: elementById['src/ext'].children,
    };
    elements.splice(2, 0, id);
    _.pull(elementById['v:_src-misc'].children, 'src/ext');
  }
}
function getFileProps(...args) {
  return getParentPlugin().app.getFileProps(...args);
}

module.exports = {
  processProjectData,
  getFileProps,
};
