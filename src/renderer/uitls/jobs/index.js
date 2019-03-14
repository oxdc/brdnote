const files = require.context('.', false, /\.js$/)
const jobs = {}

files.keys().forEach(key => {
  if (key === './index.js') return
  jobs[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export default jobs
