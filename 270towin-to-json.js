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
  const votes = Object.keys(data.states).map((key) => {
    const state = data.states[key]
    const party = data.parties[state.outcome]

    return {
      [state.state_abbr.toUpperCase()]: {
        electoral: {
          democrat: party && party.abbr === 'D' ? state.e_votes : 0,
          republican: party && party.abbr === 'R' ? state.e_votes : 0
        }
      }
    }
  })

  const partiesList = Object.keys(data.parties).map((key) => {
    return data.parties[key]
  })

  function getCandidateByParty (abbr) {
    // Using party.abbr[0] so that 'D' matches 'D-P'
    return  _.find(partiesList, (party) => party.abbr[0] === abbr).can_last_name
  }

  return {
    candidates: {
      democrat: getCandidateByParty('D'),
      republican: getCandidateByParty('R')
    },
    votes: Object.assign.apply(null, _.sortBy(votes, (vote) => Object.keys(vote)[0]))
  }
}

