const _ = require('lodash')

const csv = ['1992', '1996', '2000', '2004', '2008', '2012', '2016', '2020', '2024']
const twoSeventy = _.range(1900, 1988, 4).map((n) => '' + n)

module.exports = {
  csv,
  twoSeventy,
  all: twoSeventy.concat(csv)
}
