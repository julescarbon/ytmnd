function random(){ return Math.random() }
function rand(n){ return (Math.random()*n) }
function randint(n){ return rand(n)|0 }
function randrange(a,b){ return a + rand(b-a) }
function randsign(){ return random() >= 0.5 ? -1 : 1 }
function choice(a){ return a[randint(a.length)] }

function toArray(a){ return Array.prototype.slice.call(a) }

function shuffle(a){
  for (var i = a.length; i > 0; i--){
    var r = randint(i)
    var swap = a[i-1]
    a[i-1] = a[r]
    a[r] = swap
  }
  return a
}
