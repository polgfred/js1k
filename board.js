var doc = document, body = doc.body, children = 'children', className = 'className';

body.removeChild(body[children][0]);

function appendTo(parent, tagName) {
  var child = doc.createElement(tagName);
  parent.appendChild(child);
  return child;
}

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

appendTo(body, 'style').innerHTML =
  'td{padding:0;border:1px solid #444;width:8px;height:8px}' +
  'td:hover{background:#888}' +
  '.b{background:#800}' +
  '.o{background:#00C}';

var board = appendTo(body, 'table');
var counter = appendTo(body, 'h2');

var size = 50, pieces = 50, moves = 8, bullets = 0;

function random() {
  return Math.floor(Math.random() * size);
}

function range(n, iterator) {
  for (var i = 0; i < n; ++i) {
    iterator(i);
  }
}

function updateStatus() {
  counter.innerHTML = (
    moves == 0 && pieces > 0 ? 'LOSE' : (
      pieces == 0 ? 'WIN' :
      moves + ' : ' + pieces));
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
      if (--bullets == 0) {
        --moves;
        updateStatus();
      }
    } else {
      var cell = board[children][y][children][x];

      if (cell[className] == 'o') {
        cell[className] = '';
        --pieces;
        --bullets;
        updateStatus();
        fireBullets(x, y);
      } else {
        cell[className] = 'b';
        setTimeout(function() {
          cell[className] = '';
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

range(size, function(y) {
  var row = appendTo(board, 'tr');
  range(size, function(x) {
    appendTo(row, 'td').onclick = function() {
      if (moves > 0 && pieces > 0 && bullets == 0) {
        fireBullets(x, y);
      }
    };
  });
});

range(pieces, function() {
  for (;;) {
    var cell = board[children][random()][children][random()];
    if (cell[className] != 'o') {
      cell[className] = 'o';
      break;
    }
  }
});

updateStatus()
