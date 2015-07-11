(function(){

  var ytmnd = {}
  var sites = []
  
  var base_href = 'https://ltho.s3.amazonaws.com/ytmnd/'
  
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
    shuffle(sites)
  }

  ytmnd.preload = function(site){
    site.image_url = base_href + "/" + site.username + "/" + site.domain + "." + site.image_type
    site.sound_url = base_href + "/" + site.username + "/" + site.domain + "." + site.sound_type

    var loader = new Loader (function(){
    })
    loader.register('init')
    loader.preloadImage( site.image_url )
    audio.preload( loader, site.sound_url )
    loader.ready('init')
  }
  
  ytmnd.play = function(site){
    document.querySelector("title").innerHTML = site.title
    document.body.style.backgroundColor = site.bgcolor
    document.body.className = site.placement
    zoomtext.render(site)
  }
  
  ytmnd.stop = function(){
  }
  
  ytmnd.back = function(){
  }

  ytmnd.next = function(){
  }

  ytmnd.loop = function(){
  }
  
  return ytmnd
})()


/*
  simplified_info = {
//     'domain': domain,
//     'title': title,
//     'username': username,
    'work_safe': work_safe,
//     'bgcolor': bgcolor,
//     'placement': placement,
//     'zoom_text': zoom_text,
    'image': domain + "." + gif_type,
    'sound': domain + "." + wav_type,
    'image_type': gif_type,
    'sound_type': wav_type,
    'image_origin': image_origin,
    'sound_origin': sound_origin,
  }
*/