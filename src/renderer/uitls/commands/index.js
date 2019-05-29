const files = require.context('.', false, /\.js$/)
const commands = {}

files.keys().forEach(key => {
  if (key === './index.js') return
  commands[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export default commands
