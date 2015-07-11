ytmnd
=====

ytmnd scraper.

`./ytmnd.py -u _username_`
`./ytmnd.py domain`

serving
-------

this scraper will download the gif and mp3 from a ytmnd and write a file embedding these things in addition to zoom text (if any).

the html files use the web audio api in an attempt to get seamless looping (oddly complicated).  since they download binary data, they cannot be loaded from a `file://` url.. to view these files, put them online. alternatively, run `python -m SimpleHTTPServer 8000` from the directory and navigate to e.g. http://lvh.me:8000/

options
-------

| flag | description |
| -------------- | ----------------------- |
| `--media-only`   | only download the gif and mp3 |
| `--html-only`    | only write an html file|
| `--json-only`    | writes simplified json to a file |
| `--no-web-audio` | uses the <audio> tag instead of web audio |
| `--print-json`   | dumps raw json from ytmnd to stdout |
| `--user` (or `-u`) | fetch all ytmnds for a user |

license
-------

_This software made available under the Jollo LNT License (Leave no trace)_

