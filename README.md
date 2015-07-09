ytmnd
=====

ytmnd scraper.

`python ./ytmnd.py [--media-only] [--no-web-audio] [--json] [-u username] [domain]`

serving
-------

this scraper will download the gif and mp3 from a ytmnd and write a file embedding these things in addition to zoom text (if any).

the html files use the web audio api in an attempt to get seamless looping (oddly complicated).  since they download binary data, they cannot be loaded from a `file://` url.. to view these files, put them online. alternatively, run `python -m SimpleHTTPServer 8000` from the directory and navigate to e.g. http://lvh.me:8000/

options
-------

|
| -------------- | ----------------------- |
| --media-only   | only download the gif and mp3 |
| --no-web-audio | uses the <audio> tag instead of web audio |
| --json         | dumps json for the ytmnd to stdout |
| --user (or -u) | fetch all ytmnds for a user |

license
-------

_This software made available under the Jollo LNT License (Leave no trace)_

