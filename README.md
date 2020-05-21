# presidential election data [![Build Status](https://travis-ci.org/brandly/presidential-election-data.svg?branch=master)](https://travis-ci.org/brandly/presidential-election-data)

unofficial repository, no affiliation with the FEC

data extracted from here http://www.fec.gov/pubrec/electionresults.shtml

and from http://www.270towin.com/historical-presidential-elections/

### install

```shell
$ npm install --save presidential-election-data
```

view any files in `./json` to see how the data is formatted

### goal

set the data free with consistently-formatted JSON

### how

most of these from the FEC were downloaded as an `.xls`, converted to a `.csv`, and then parsed as text into `.json`. the `.csv` to `.json` conversion was handled by `csv-to-json.js`.

some of them went `.html`/`.pdf` -> `.csv` -> `.json`, and required some manual, potentially error-prone formatting of the data.

the data coming from 270towin was scraped by `scrape-270towin.js` into raw `.js`, which was then converted to `.json` by `270towin-to-json.js`.

### missing

popular vote counts before 1992

### shoutouts

http://www.convertcsv.com/html-table-to-csv.htm
