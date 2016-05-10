const csv = ['1992', '1996', '2000', '2004', '2008', '2012']
const twoSeventy = ['1960', '1964', '1968', '1972', '1976', '1980', '1984', '1988']

module.exports = {
  csv,
  twoSeventy,
  all: twoSeventy.concat(csv)
}
