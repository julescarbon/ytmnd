(function(){

  var ytmnd = {}
  var sites = []
  
  ytmnd.init = function(names){
    var loader = new Loader(ytmnd.ready)
    loader.register('init')
    names.forEach(function(name){
      loader.register(name)
      fetch(name + '.json').then(function(rows){
        sites = sites.concat(rows)
        loader.ready(name)
      })
    })
    loader.ready('init')
  }
  
  ytmnd.ready = function(){
    var next = ytmnd.next()
  }
  
  ytmnd.play = function(data){
  }
  
  ytmnd.stop = function(){
  }
  
  return ytmnd
})()


/*
  simplified_info = {
    'domain': domain,
    'title': title,
    'username': username,
    'work_safe': work_safe,
    'bgcolor': bgcolor,
    'placement': placement,
    'zoom_text': zoom_text,
    'image': domain + "." + gif_type,
    'sound': domain + "." + wav_type,
    'image_type': gif_type,
    'sound_type': wav_type,
    'image_origin': image_origin,
    'sound_origin': sound_origin,
  }
*/