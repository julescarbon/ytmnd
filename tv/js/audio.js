var audio = (function(){

  var audio = {}

  var context = new AudioContext()
  var source
  var current = ""
  var timeout
  
  var bufs = {}
  var sources = {}

  audio.preload = function(site, loader){
    loader.register(site.domain + "_sound")
    var request = new XMLHttpRequest()
    request.open('GET', site.sound_url, true) 
    request.responseType = 'arraybuffer'
    request.onload = function() {
      context.decodeAudioData(request.response, function(buf) {
        bufs[site.domain] = buf
        loader.ready(site.domain + "_sound")
      }, function () { console.error('The request failed.') } )
    }
    request.onerror = function() {
      ytmnd.error()
    }
    request.send()
  }
  
  audio.loaded = function(domain){
    return (domain in bufs)
  }

  audio.make_source = function(domain){
    var buf = bufs[domain]    
    var source = context.createBufferSource()
    source.connect(context.destination)
    source.buffer = buf
    
    sources[domain] = sources[domain] || []
    sources[domain].push(source)
    return source
  }
  
  audio.play = function(domain){
    console.log("play", domain)
    
    current = domain
    
    var source
    
    var startTime = context.currentTime
    var delay
    
    clearTimeout(timeout);

    (function loop(){
      if (source) {
        var dt = context.currentTime - startTime
        console.log("got a source", dt, delay)
        if (dt > 20) {
          ytmnd.next()
        }
        else {
          timeout = setTimeout(loop, delay)
          source.start(0)
          source.started = true
          source = audio.make_source(domain)
        }
      }
      else {
        timeout = setTimeout(loop, 0)
        source = audio.make_source(domain)
        delay = source.buffer.duration * 1000 - (source.buffer.duration < 2 ? 0 : 60)
      }
    })()
    
  }
  
  audio.stop_current = function(){
    audio.stop(current)
    current = ""
  }
  
  audio.stop = function(domain){
    if (! sources[domain]) return

    clearTimeout(timeout)

    sources[domain].forEach(function(source){
      if (source.started) {
        source.stop(0)
      }
    })
    sources[domain] = []
    delete bufs[domain]
  }
  
  return audio

})()
