var doc = document,
    body = doc.body,
    size = 50,
    pieces = 50,
    moves = 8,
    bullets = 0;

/*
these styles are perty but too expensive:

//'body{background:#111}' +
//'h2{text-align:center;color:#EEE}' +
//'table{margin:auto;border-collapse:collapse;border-spacing:0}' +
//'td{padding:0;border:1px solid #444}' +
//'div{width:8px;height:8px}' +
//'div:hover{background:#444}' +
//'.b div{background:#EEE}' +
//'.o div{background:#F80}';
*/

body.innerHTML =
  '<style>' +
  'td{padding:0;border:1px solid #444;width:8px;height:8px}' +
  'td:hover{background:#888}' +
  '.b{background:#800}' +
  '.o{background:#00C}' +
  '</style>' +
  '<h2></h2>' +
  '<table>' +
  Array(size + 1).join('<tr>' + Array(size + 1).join('<td>') + '</tr>') +
  '</table>';

var board = body.children[2].children[0],
    counter = body.children[1];

board.onclick = function(event) {
  var cell = event.target;

  if(cell.tagName == 'TD') {
    if (moves && pieces && !bullets) {
      fireBullets(cell.cellIndex, cell.parentNode.rowIndex);
    }
  }
}

function updateStatus() {
  counter.innerHTML = (
    !moves && pieces ? 'You Lose!' : (
      !pieces ? 'You win!' :
      'Click to fire! [' + moves + ' : ' + pieces + ']'));
}

function fireBullets(x, y) {
  fireBullet(x, y, -1,  0);
  fireBullet(x, y,  1,  0);
  fireBullet(x, y,  0, -1);
  fireBullet(x, y,  0,  1);
}

function fireBullet(x, y, dx, dy) {
  ++bullets;

  (function moveBullet(x, y) {
    if (x < 0 || x >= size || y < 0 || y >= size) {
      if (!--bullets) {
        --moves;
        updateStatus();
      }
    } else {
      var cell = board.children[y].children[x];

      if (cell.className == 'o') {
        cell.className = '';
        --pieces;
        --bullets;
        updateStatus();
        fireBullets(x, y);
      } else {
        cell.className = 'b';
        setTimeout(function() {
          cell.className = '';
          if (dx != 0) {
            moveBullet(x + dx, y);
          } else {
            moveBullet(x, y + dy);
          }
        }, 25);
      }
    }
  }(x, y));
}

function random() {
  return Math.floor(Math.random() * size);
}

for (var i = 0; i < pieces; ++i) {
  for (;;) {
    var cell = board.children[random()].children[random()];

    if (cell.className != 'o') {
      cell.className = 'o';
      break;
    }
  }
}

updateStatus();
