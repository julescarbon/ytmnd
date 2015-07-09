(function(){
  var hasWebKit = ('webkitAudioContext' in window) && !('chrome' in window)
  var context = new webkitAudioContext()
  var request = new XMLHttpRequest()
  request.open('GET', url, true) 
  request.responseType = 'arraybuffer'
  request.onload = function() {
    context.decodeAudioData(request.response, function(response) {
      // source.loop = true
			loop()
			var source
			function loop(){
        if (source) {
          source.start(0)
          setTimeout(loop, source.buffer.duration * 1000 - 60)
        }
        else {
          setTimeout(loop, 0)
        }
        source = context.createBufferSource()
        source.connect(context.destination)
        source.buffer = response
			}
    }, function () { console.error('The request failed.') } )
  }
  request.send()
})()
