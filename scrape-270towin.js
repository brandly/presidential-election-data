const request = require('superagent')
const fs = require('fs')
const path = require('path')
const years = require('./supported-years').twoSeventy

years.map(scrape)

function scrape (year) {
  requestData(year, (error, results) => {
    if (error) throw error

    const fullOutput = results + `

module.exports = {
  states,
  parties
}

    `

    const outputFile = path.resolve('./270towin', year + '.js')

    fs.writeFile(outputFile, fullOutput, (error) => {
      if (error) throw error
    })
  })
}

function requestData (year, cb) {
  const url = `www.270towin.com/${year}_Election/interactive_map`

  request
    .get(url)
    .end(function (err, res) {
      if (err) return cb(err)

      const withoutLeading = 'var states' + res.text.split('var states')[1]
      const withoutTrailing = withoutLeading.split('var statePositions')[0].trim()

      cb(null, withoutTrailing)
    })
}
