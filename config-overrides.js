const { override, fixBableImports } = require('customize-cra')
module.exports = override(
  fixBableImports('import', {
    libraryName: 'antd-mobile',
    style: 'css',
  })
)
