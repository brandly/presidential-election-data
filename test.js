// Checks each year's national totals against official figures, so a bad
// state value (e.g. an OCR typo in a source table) shows up as a mismatch.
//
// Electoral totals are the official electoral college counts for the
// Democratic and Republican candidates. Popular totals come from the "Total"
// row of the FEC's electoral and popular vote summary for each year (for 2024,
// "other" is the FEC total vote minus Harris and Trump).
const assert = require('assert')
const data = require('./')

const expected = {
  1900: { electoral: [155, 292] },
  1904: { electoral: [140, 336] },
  1908: { electoral: [162, 321] },
  1912: { electoral: [435, 8] },
  1916: { electoral: [277, 254] },
  1920: { electoral: [127, 404] },
  1924: { electoral: [136, 382] },
  1928: { electoral: [87, 444] },
  1932: { electoral: [472, 59] },
  1936: { electoral: [523, 8] },
  1940: { electoral: [449, 82] },
  1944: { electoral: [432, 99] },
  1948: { electoral: [303, 189] },
  1952: { electoral: [89, 442] },
  1956: { electoral: [73, 457] },
  1960: { electoral: [303, 219] },
  1964: { electoral: [486, 52] },
  1968: { electoral: [191, 301] },
  1972: { electoral: [17, 520] },
  1976: { electoral: [297, 240] },
  1980: { electoral: [49, 489] },
  1984: { electoral: [13, 525] },
  1988: { electoral: [111, 426] },
  1992: { electoral: [370, 168], popular: [44909889, 39104545, 19742267] },
  1996: { electoral: [379, 159], popular: [47402357, 39198755, 8085402] },
  2000: { electoral: [266, 271], popular: [50999897, 50456002, 3949201] },
  2004: { electoral: [251, 286], popular: [59028444, 62040610, 1226291] },
  2008: { electoral: [365, 173], popular: [69498516, 59948323, 1866981] },
  2012: { electoral: [332, 206], popular: [65915795, 60933504, 2236111] },
  2016: { electoral: [227, 304], popular: [65853514, 62984828, 7830934] },
  2020: { electoral: [306, 232], popular: [81283501, 74223975, 2922155] },
  2024: { electoral: [226, 312], popular: [75017613, 77302580, 2918109] }
}

const sum = (votes, type, key) =>
  Object.values(votes).reduce((total, state) => total + state[type][key], 0)

const failures = []
for (const year of Object.keys(expected)) {
  if (!data[year]) {
    failures.push(`${year}: missing from the package`)
    continue
  }
  const { votes } = data[year]
  const actual = {
    electoral: [sum(votes, 'electoral', 'democrat'), sum(votes, 'electoral', 'republican')]
  }
  if (expected[year].popular) {
    actual.popular = ['democrat', 'republican', 'other'].map((key) => sum(votes, 'popular', key))
  }
  try {
    assert.deepStrictEqual(actual, expected[year])
  } catch (error) {
    failures.push(`${year}: expected ${JSON.stringify(expected[year])}, got ${JSON.stringify(actual)}`)
  }
}

for (const year of Object.keys(data)) {
  if (!expected[year]) failures.push(`${year}: no expected totals`)
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}
console.log(`national totals match for ${Object.keys(expected).length} years`)
