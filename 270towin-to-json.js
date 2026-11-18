const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const years = require('./supported-years').twoSeventy

years.map(createJson)

function createJson (year) {
  const data = require('./270towin/' + year)
  const output = buildDataSet(data)

  const outputFile = path.resolve('./json', year + '.json')
  fs.writeFile(outputFile, JSON.stringify(output, null, 2), (error) => {
    if (error) throw error
  })
}

function buildDataSet (data) {
  // Using party.abbr[0] so that 'D' matches 'D-P'. Take the first match
  // because a later party can share the prefix (1960's Byrd is also 'D').
  const democrat = _.findKey(data.parties, (party) => party.abbr[0] === 'D')
  const republican = _.findKey(data.parties, (party) => party.abbr[0] === 'R')

  const votes = Object.keys(data.states).map((key) => {
    const state = data.states[key]

    // state.parties maps party key -> electoral votes, which covers states
    // that split their votes or had faithless electors
    return {
      [state.state_abbr.toUpperCase()]: {
        electoral: {
          democrat: parseInt(state.parties[democrat] || 0, 10),
          republican: parseInt(state.parties[republican] || 0, 10)
        }
      }
    }
  })

  return {
    candidates: {
      democrat: data.parties[democrat].can_last_name,
      republican: data.parties[republican].can_last_name
    },
    votes: Object.assign.apply(null, _.sortBy(votes, (vote) => Object.keys(vote)[0]))
  }
}
