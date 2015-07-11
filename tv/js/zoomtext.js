var zoomtext = (function(){

  var zoomtext = {}

  var el = document.querySelector("#zoom_text")

  zoomtext.empty = function(){
    el.innerHTML = ""
  }
  
  zoomtext.render = function(site){
    if (! site.zoom_text.line_1) {
      return zoomtext.empty()
    }

    var text = ytmnd_info['site']['zoom_text']

    var offset = 100, rows = ""
    if ("line_3" in zoom_text && zoom_text["line_3"].length > 0) {
      rows += zoomtext.add_row( zoom_text['line_3'], offset, 500 )
      offset += 50
    }
    if ("line_2" in zoom_text && zoom_text["line_2"].length > 0) {
      rows += zoomtext.add_row( zoom_text['line_2'], offset, 250 )
      offset += 50
    }
    if ("line_1" in zoom_text && zoom_text["line_1"].length > 0) {
      rows += zoomtext.add_row( zoom_text['line_1'], offset, 500 )
    }
    
    el.innerHTML = rows.join("")
  }
  zoomtext.add_row = function(text, offset, top){
    var z_index, row_left, row_top, font_size, color
    var row = ""
    for (var i = 1; i < 51; i++) {
      z_index = offset + i
      row_left = i * 2
      row_top = top + i
      font_size = i * 2
      if (i == 50) {
        color = 0
      }
      else {
        color = i * 4
      }
    
      row += "<div style='z-index: " + z_index + "; left: " + row_left + "px; "
      row += "top: " + row_top + "px; color: rgb(" + [color,color,color] + "); "
      row += "font-size: " + font_size + "pt;'>" + text + "</div>"
    }
    return row
  }
  
  return zoomtext
})()