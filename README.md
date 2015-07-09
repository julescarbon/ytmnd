ytmnd
=====

ytmnd scraper

`python ./ytmnd.py [--media-only] [--no-web-audio] [--json] [-u username] [domain]`

html files use web audio api in an attempt to get (almost) seamless looping. to load these files run an http server from the directory, e.g.

`python -m SimpleHTTPServer 8000`

and navigate to http://lvh.me:8000/

