var Loader = Loader || (function(){
  function Loader (readyCallback, view){
    this.assets = {};
    this.images = [];
    this.readyCallback = readyCallback;
    this.count = 0
    this.view = view
    this.loaded = false
  }

  // Register an asset as loading
  Loader.prototype.register = function(s){
    this.assets[s] = false;
    this.count += 1
  }

  // Signal that an asset has loaded
  Loader.prototype.ready = function(s){
    window.debug && console.log("ready >> " + s);

    this.assets[s] = true;
    if (this.loaded) return;
    
    this.view && this.view.update( this.percentRemaining() )
    
    if (! this.isReady()) return;

    this.loaded = true;
    if (this.view) {
      this.view && this.view.finish(this.readyCallback)
    }
    else {
      this.readyCallback && this.readyCallback();
    }
  }

  // (boolean) Is the loader ready?
  Loader.prototype.isReady = function(){
    for (var s in this.assets) {
      if (this.assets.hasOwnProperty(s) && this.assets[s] != true) {
        return false;
      }
    }
    return true;
  }
  
  // (float) Percentage of assets remaining
  Loader.prototype.percentRemaining = function(){
    return this.remainingAssets() / this.count 
  }

  // (int) Number of assets remaining
  Loader.prototype.remainingAssets = function(){
    var n = 0;
    for (var s in this.assets) {
      if (this.assets.hasOwnProperty(s) && this.assets[s] != true) {
        n++;
        // console.log('remaining: ' + s);
      }
    }
    return n;
  }

  // Preload the images in config.images
  Loader.prototype.preloadImages = function(images){
    this.register("preload");
    for (var i = 0; i < images.length; i++) {
      this.preloadImage(images[i]);
    }
    this.ready("preload");
  }
  Loader.prototype.preloadImage = function(src){
    if (! src || src == "none") return;
    var _this = this;
    this.register(src);
    var img = new Image();
    img.onload = function(){
      _this.ready(src);
    }
    img.src = src;
    if (img.complete) img.onload();
    _this.images.push(img);
  }

  return Loader;
})();