const years = require('./supported-years').all

const result = {}
years.forEach((year) => {
  result[year] = require('./json/' + year + '.json')
})

module.exports = result
