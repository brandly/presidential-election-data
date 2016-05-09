const path = require('path')
const fs = require('fs')
const _ = require('lodash')

createJsonForCsv('2004')

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

  const headers = rows[uselessLeadingRowsCount]
  const candidates = extractCandidates(headers)

  const firstStateIndex = uselessLeadingRowsCount + 1
  const numberOfStates = 50

  const stateRows = rows.slice(firstStateIndex, firstStateIndex + numberOfStates + 1)

  const stateData = stateRows.map(extractStateData)
  const votes = Object.assign.apply(Object, stateData)

  return {
    candidates,
    votes
  }
}

function extractCandidates (row) {
  const cells = row.split(',')
  const theD = ' (D)'
  const theR = ' (R)'

  const democratSplits = _.find(cells, (c) => c.endsWith(theD)).split(' ')
  const republicanSplits = _.find(cells, (c) => c.endsWith(theR)).split(' ')

  return {
    democrat: democratSplits[democratSplits.length - 2],
    republican: republicanSplits[republicanSplits.length - 2]
  }
}

function extractStateData (row) {
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
    [state]: {
      electoral: {
        democrat: safelyParseInt(cells[1]),
        republican: safelyParseInt(cells[2])
      },
      popular: {
        democrat: safelyParseInt(popular[0]),
        republican: safelyParseInt(popular[1]),
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
