#!/usr/bin/python

import sys
import os
import os.path
import re
import time
import urllib2
import simplejson
from optparse import OptionParser

class YTMND:

  def __init__ (self):
    self.user_mode = False
    self.media_only = False
    self.html_only = False
    self.json_only = False
    self.no_web_audio = False
    self.print_json = False
    self.sleep = 5

  # Scrapes sites from the profile page, then fetches them
  def fetch_user(self, user):
    if user == "":
      print("expecting one ytmnd name, got "+str(sys.argv))
      return

    ytmnd_name = user 
    ytmnd_html = urllib2.urlopen("http://ytmnd.com/users/" + ytmnd_name + "/sites").readlines()
    
    domains = []
    
    for line in ytmnd_html:
      if 'profile_link' in line:
        expr = r"site_link\" href=\"http://(\S+).ytmn(d|sfw)?.com\""
        domain = re.search(expr,line).group(1)
        domains.append(domain)

    if self.json_only:
      parsed = []
      for domain in domains:
        parsed.append( self.fetch_ytmnd( domain ) )
      self.write_json(ytmnd_name, parsed)

    else:
      print ">> found %d domains" % len( domains )
      os.system("mkdir -p %s" % user)
      os.chdir(user)
      if not self.no_web_audio:
        self.copy_ytmnd_js()
      for domain in domains:
        self.fetch_ytmnd( domain )
      os.chdir("..")

  # Fetches a single subdomain
  def fetch_ytmnd(self, domain):

    if domain == "":
      print("expecting one ytmnd name, got "+str(sys.argv))
      return

    if not self.print_json:
      print "fetching %s" % domain
    if not self.sleep:
      time.sleep(self.sleep)

    ytmnd_name = domain
    ytmnd_html = urllib2.urlopen("http://" + domain + ".ytmnd.com").read()
    expr = r"ytmnd.site_id = (\d+);"
    ytmnd_id = re.search(expr,ytmnd_html).group(1)
    ytmnd_info = simplejson.load(urllib2.urlopen("http://" + domain + ".ytmnd.com/info/" + ytmnd_id + "/json"))

    if self.print_json:
      print simplejson.dumps(ytmnd_info, sort_keys=True, indent=4 * ' ')
    elif self.json_only:
      return self.parse_json(ytmnd_info)
    elif self.media_only:
      self.fetch_media(ytmnd_info)
    elif self.html_only:
      self.write_index(ytmnd_info)
    else:
      self.fetch_media(ytmnd_info)
      self.write_index(ytmnd_info)

    return ytmnd_info

  # Fetches the gif and mp3 for a post
  def fetch_media(self, ytmnd_info):
    domain = ytmnd_info['site']['domain']
    original_gif = ytmnd_info['site']['foreground']['url']
    gif_type = original_gif.split(".")[-1]
    original_wav = ytmnd_info['site']['sound']['url']
    wav_type = ytmnd_info['site']['sound']['type']
    
    if 'alternates' in ytmnd_info['site']['sound']:
      key = ytmnd_info['site']['sound']['alternates'].keys()[0]
      value = ytmnd_info['site']['sound']['alternates'][key]
      if value['file_type'] != 'swf':
        original_wav = value['file_url']
        wav_type = ytmnd_info['site']['sound']['file_type']

    os.system("wget --quiet -O %s %s" % (domain + "." + gif_type, original_gif))
    os.system("wget --quiet -O %s %s" % (domain + "." + wav_type, original_wav))

  # Writes an html file emulating the ytmnd format
  def write_index(self, ytmnd_info):
  
    # print simplejson.dumps(ytmnd_info)
    domain = ytmnd_info['site']['domain']
    bgcolor = ytmnd_info['site']['background']['color']
    title = ytmnd_info['site']['description']
    placement = ytmnd_info['site']['foreground']['placement']

    original_gif = ytmnd_info['site']['foreground']['url']
    gif_type = original_gif.split(".")[-1]
    wav_type = ytmnd_info['site']['sound']['type']
    
    if 'alternates' in ytmnd_info['site']['sound']:
      key = ytmnd_info['site']['sound']['alternates'].keys()[0]
      value = ytmnd_info['site']['sound']['alternates'][key]
      if value['file_type'] != 'swf':
        original_wav = value['file_url']
        wav_type = ytmnd_info['site']['sound']['file_type']

    fn = open(domain + ".html", 'w')
    fn.write("<html>\n")
    fn.write("<head>\n")
    fn.write("<title>%s</title>\n" % title)
    fn.write("<style>\n")
    fn.write("*{margin:0;padding:0;width:100%;height:100%;}\n")
    fn.write("body{font-size:12px;font-weight:normal;font-style:normal;overflow:hidden;")
    fn.write("background-color:%s;" % bgcolor)
    fn.write("background-image:url(%s.%s);" % (domain, gif_type))
    if placement == "mc":
      fn.write("background-position: center center; background-repeat: no-repeat;}")
    elif placement == "tile":
      fn.write("background-position: top left; background-repeat: repeat;}")
    fn.write("\n")
    fn.write("#zoom_text{position:absolute;left:0;top:0;width:1000px;z-index:10;text-align:center;font-family:Tahoma, sans-serif}")
    fn.write("#zoom_text div{position:absolute;width:1000px}")
    fn.write("</style>\n")
    fn.write("</head>\n")

    fn.write("<body>\n")
    self.write_zoom_text(fn, ytmnd_info)
    
    if self.no_web_audio:
      fn.write("<audio src='%s.%s' loop autoplay>\n" % (domain, wav_type))
      fn.write("</body>\n")
    else:
      fn.write("</body>\n")
      fn.write("<script>var url = '%s.%s'</script>\n" % (domain, wav_type))
      fn.write("<script src='ytmnd.js'></script>\n")
      fn.write("<script type='application/json'>\n")
      fn.write(simplejson.dumps(ytmnd_info, sort_keys=True, indent=4 * ' ') + "\n")
      fn.write("</script>\n")
    fn.write("</html>")

    fn.close()
  
  # print out the zoom text
  def write_zoom_text (self, fn, ytmnd_info):
    if 'zoom_text' not in ytmnd_info['site']:
      return
    
    zoom_text = ytmnd_info['site']['zoom_text']

    fn.write('<div id="zoom_text">')

    offset = 100
    if "line_3" in zoom_text and len(zoom_text["line_3"]) > 0:
      self.write_zoom_layers( fn, zoom_text['line_3'], offset, 500 )
      offset += 50
    if "line_2" in zoom_text and len(zoom_text["line_2"]) > 0:
      self.write_zoom_layers( fn, zoom_text['line_2'], offset, 250 )
      offset += 50
    if "line_1" in zoom_text and len(zoom_text["line_1"]) > 0:
      self.write_zoom_layers( fn, zoom_text['line_1'], offset, 0 )
  
    fn.write('</div>')

  # print the layers of zoom text
  def write_zoom_layers (self, fn, text, offset, top):
    for i in xrange(1, 51):
      z_index = offset + i
      row_left = i * 2
      row_top = top + i
      font_size = i * 2
      if i == 50:
        color = 0
      else:
        color = i * 4
    
      fn.write("<div style='z-index: %d; left: %dpx; top: %dpx; color: rgb(%d, %d, %d); font-size: %dpt;'>%s</div>"
        % (z_index, row_left, row_top, color, color, color, font_size, text))

  # Copies the looping audio JS into place
  def copy_ytmnd_js (self):
    if not os.path.isfile("ytmnd.js"):
      os.system("cp ../ytmnd.js .")

  # Parses data we need out of JSON
  def parse_json (self, ytmnd_info):
    domain = ytmnd_info['site']['domain']
    bgcolor = ytmnd_info['site']['background']['color']
    title = ytmnd_info['site']['description']
    placement = ytmnd_info['site']['foreground']['placement']

    gif_type = ytmnd_info['site']['foreground']['url'].split(".")[-1]
    wav_type = ytmnd_info['site']['sound']['type']
    zoom_text = ytmnd_info['site']['zoom_text']
    if len(zoom_text['line_1']) == 0:
      zoom_text = ""
    
    if 'alternates' in ytmnd_info['site']['sound']:
      key = ytmnd_info['site']['sound']['alternates'].keys()[0]
      value = ytmnd_info['site']['sound']['alternates'][key]
      if value['file_type'] != 'swf':
        wav_type = ytmnd_info['site']['sound']['file_type']

    simplified_info = {
      'domain': domain,
      'bgcolor': bgcolor,
      'title': title,
      'placement': placement,
      'gif': domain + "." + gif_type,
      'wav': domain + "." + wav_type,
      'gif_type': gif_type,
      'wav_type': wav_type,
      'zoom_text': zoom_text,
    }

    return simplified_info

  # Writes site JSON to a file
  def write_json (self, domain, data):
    fn = open(domain + '.json', 'w')
    fn.write( simplejson.dumps(data) )
    fn.close()

if __name__ == '__main__':

  parser = OptionParser()

  parser.add_option("-u", "--user", action="store_true")
  parser.add_option("-m", "--media-only", action="store_true")
  parser.add_option("-f", "--html-only", action="store_true")
  parser.add_option("-j", "--json-only", action="store_true")
  parser.add_option("-w", "--no-web-audio", action="store_true")
  parser.add_option("-p", "--print-json", action="store_true")
  parser.add_option("-s", "--sleep", action="store", type="int", dest="sleep", default=5)

  (options, args) = parser.parse_args()

  if len(args) == 0:
    parser.error("incorrect number of arguments")
    sys.exit(1)
  
  ytmnd = YTMND ()
  ytmnd.user_mode = options.user
  ytmnd.media_only = options.media_only
  ytmnd.html_only = options.html_only
  ytmnd.json_only = options.json_only
  ytmnd.no_web_audio = options.no_web_audio
  ytmnd.print_json = options.print_json
  ytmnd.sleep = options.sleep

  if options.user:
    user = args[0]
    ytmnd.fetch_user( user )

  else:
    name = args[0].replace("http://","").replace(".ytmnsfw.com","").replace(".ytmnd.com","").replace("/","")
    ytmnd.fetch_ytmnd( name )

