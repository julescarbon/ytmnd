var audio = (function(){

  var audio = {}

  var context = new webkitAudioContext()
  var source
  var current = ""
  
  var bufs = {}
  var sources = {}

  audio.preload = function(site, loader){
    loader.register(site.domain + "_sound")
    var request = new XMLHttpRequest()
    request.open('GET', url, true) 
    request.responseType = 'arraybuffer'
    request.onload = function() {
      context.decodeAudioData(request.response, function(buf) {
        bufs[site.domain] = buf
        loader.ready(site.domain + "_sound")
      }, function () { console.error('The request failed.') } )
    }
    request.send()
  }

  audio.play = function(domain){
    var buf = bufs[domain]    
    var source = context.createBufferSource()
    source.connect(context.destination)
    source.buffer = buf
    source.start(0)
    
    sources[domain] = sources[domain] || []
    sources[domain].push(source)
  }
  
/*
    (function loop(){
      if (source) {
        source.start(0)
        setTimeout(loop, source.buffer.duration * 1000 - (source.buffer.duration < 2 ? 0 : 60) )
      }
      else {
        setTimeout(loop, 0)
      }
    })()
*/

})()
