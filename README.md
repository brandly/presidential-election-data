# presidential election data

unofficial repository, no affiliation with the FEC

data extracted from here http://www.fec.gov/pubrec/electionresults.shtml

### goal

set the data free with consistently-formatted JSON

### how

most of these were downloaded as an `.xls`, converted to a `.csv`, and then parsed as text into `.json`. the `.csv` to `.json` conversion was handled by `csv-to-json.js`.

some of them went `.html`/`.pdf` -> `.csv` -> `.json`, and required some manual, potentially error-prone formatting of the data.

### missing

1988, 1984

the data is locked up in a `.pdf`, and the table i extracted the data from in other years is not provided for these years. any help is appreciated.

### shoutouts

http://www.convertcsv.com/html-table-to-csv.htm
