var ytmnd = (function(){

  var ytmnd = {}
  var sites = []
  var loaded = {}
  var index = 0
  var play_immediately = true
  
  var base_href = 'https://ltho.s3.amazonaws.com/ytmnd'
  
  ytmnd.init = function(names){
    var loader = new Loader(ytmnd.ready)
    loader.register('init')
    names.forEach(function(name){
      loader.register(name)
      fetch("users/" + name + '.json').then(function(response){
        return response.json()
      }).then(function(json){
        sites = sites.concat(json)
        loader.ready(name)
      })
    })
    loader.ready('init')
  }
  
  ytmnd.ready = function(){
    shuffle(sites)
    ytmnd.play_index(index)
  }

  ytmnd.preload = function(site){
    site.image_url = base_href + "/" + site.username + "/" + site.domain + "." + site.image_type
    site.sound_url = base_href + "/" + site.username + "/" + site.domain + "." + site.sound_type

    var loader = new Loader (function(){
      loaded[site.domain] = site
      if (next_domain == site.domain) {
        ytmnd.play(site)
      }
    })
    loader.register('init')
    loader.preloadImage( site.image_url )
    audio.preload( site, loader )
    loader.ready('init')
  }

  ytmnd.play_index = function(index){
    var site = sites[index]
    if (loaded[site.domain]) {
      ytmnd.play(site)
    }
    else {
      next_domain = site.domain
      ytmnd.preload(site)
    }
  }
    
  ytmnd.play = function(site){
    document.querySelector("title").innerHTML = site.title
    document.body.style.backgroundColor = site.bgcolor
    document.body.style.backgroundImage = "url(" + site.image_url + ")"
    document.body.className = site.placement
    audio.play(site.domain)
    zoomtext.render(site)
  }
  
  ytmnd.stop = function(){
    var site = sites[index]
    loaded[site.domain] = false
    audio.stop(site.domain)
    zoomtext.empty()
  }
  
  ytmnd.back = function(){
    ytmnd.stop()
    index = (index-1) % sites.length
    ytmnd.play_index(index)
    setTimeout(function(){
      ytmnd.preload_index((index-1 + sites.length) % sites.length)
    }, 1000)
  }

  ytmnd.next = function(){
    ytmnd.stop()
    index = (index+1) % sites.length
    ytmnd.play_index(index)
    setTimeout(function(){
      ytmnd.preload_index((index+1) % sites.length)
    }, 1000)
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
    'image_type': gif_type,
    'image_origin': image_origin,
//     'sound': domain + "." + wav_type,
//     'sound_type': wav_type,
//     'sound_origin': sound_origin,
  }
*/