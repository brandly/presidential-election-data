const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const years = require('./supported-years').csv

years.forEach(createJsonForCsv)

function createJsonForCsv (year) {
  const inputFile = path.resolve('./csv', year + '.csv')
  const outputFile = path.resolve('./json', year + '.json')

  fs.readFile(inputFile, (error, data) => {
    if (error) throw error

    const rows = data.toString().split('\n')
    const output = buildDataSet(rows)

    fs.writeFile(outputFile, JSON.stringify(output, null, 2), (error) => {
      if (error) throw error
    })
  })
}

function buildDataSet (rows) {
  const lastUselessRow = _.findIndex(rows, (row) => row.startsWith('STATE'))

  const uselessLeadingRowsCount = rows[lastUselessRow].includes('(R)') ? lastUselessRow : lastUselessRow + 1

  const headerCells = rows[uselessLeadingRowsCount].split(',')
  const candidatesIndices = getCandidatesIndices(headerCells)
  const candidates = extractCandidates(headerCells, candidatesIndices)

  const firstStateIndex = uselessLeadingRowsCount + 1
  const numberOfStates = 50

  const stateRows = rows.slice(firstStateIndex, firstStateIndex + numberOfStates + 1)

  const stateData = stateRows.map(extractStateData.bind(null, candidatesIndices.demBeforeRep))
  const votes = Object.assign.apply(Object,  _.sortBy(stateData, (vote) => Object.keys(vote)[0]))

  return {
    candidates,
    votes
  }
}

function getCandidatesIndices (cells) {
  const theD = ' (D)'
  const theR = ' (R)'

  const democrat = _.findIndex(cells, (c) => c.endsWith(theD))
  const republican = _.findIndex(cells, (c) => c.endsWith(theR))

  return {
    democrat,
    republican,
    demBeforeRep: democrat < republican
  }
}

function extractCandidates (cells, indices) {
  const democratSplits = cells[indices.democrat].split(' ')
  const republicanSplits = cells[indices.republican].split(' ')

  return {
    democrat: democratSplits[democratSplits.length - 2],
    republican: republicanSplits[republicanSplits.length - 2]
  }
}

function extractStateData (demBeforeRep, row) {
  const cells = row.split(',')
  const state = cells[0]

  // This is a mess but since we're blinding splitting on ',', we gotta
  // do some snooping around to find numbers that are like `"123,456"`
  const popular = []
  var i = 3
  while (popular.length < 3) {
    if (cells[i][0] !== '"' && _.last(cells[i]) !== '"') {
      popular.push(cells[i])
      i += 1
    } else if (cells[i][0] === '"' && _.last(cells[i]) === '"') {
      popular.push(cells[i])
      i += 1
    } else if (cells[i][0] === '"' && _.last(cells[i + 1]) === '"') {
      popular.push(cells[i] + cells[i + 1])
      i += 2
    } else if (cells[i][0] === '"' && _.last(cells[i + 2]) === '"') {
      popular.push(cells[i] + cells[i + 1] + cells[i + 2])
      i += 3
    } else {
      throw new Error('Did not see this coming')
    }
  }

  return {
    [state.toUpperCase()]: {
      electoral: {
        democrat: safelyParseInt(cells[demBeforeRep ? 1 : 2]),
        republican: safelyParseInt(cells[demBeforeRep ? 2 : 1])
      },
      popular: {
        democrat: safelyParseInt(popular[demBeforeRep ? 0 : 1]),
        republican: safelyParseInt(popular[demBeforeRep ? 1 : 0]),
        other: safelyParseInt(popular[2])
      }
    }
  }
}

const NON_NUMBERS = /\D/g
function safelyParseInt (val) {
  val = val.replace(NON_NUMBERS, '')
  return val === '' ? 0 : parseInt(val, 10)
}
