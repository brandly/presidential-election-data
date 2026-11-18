const _ = require('lodash')

const csv = ['1992', '1996', '2000', '2004', '2008', '2012', '2016']
const twoSeventy = _.range(1900, 1992, 4).map((n) => '' + n)
// json written by hand, with no source file in this repo
const manual = ['2020', '2024']

module.exports = {
  csv,
  twoSeventy,
  all: twoSeventy.concat(csv, manual)
}
