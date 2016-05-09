const years = require('./supported-years')

const result = {}
years.forEach((year) => {
  result[year] = require('./json/' + year + '.json')
})

module.exports = result
