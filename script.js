function onChange() {
  var width = parseFloat(document.getElementById("width").value);
  var height = parseFloat(document.getElementById("height").value);
  var fill;
  switch (document.getElementById("fill").selectedIndex) {
    case 0:
      fill = "black";
      break;
    case 1:
      fill = "#337ab7";
      break;
    case 2:
      fill = "#5cb85c";
      break;
    case 3:
      fill = "#f0ad4e";
      break;
    case 4:
      fill = "#d9534f";
      break;
    case 5:
      fill = img;
      break;
  }
  var rotation = parseFloat(document.getElementById("rotation").value);
  var key = document.getElementById("key").selectedIndex ? 'sideLength' : 'radius';
  var value = parseFloat(document.getElementById("value").value);
  var sides = parseFloat(document.getElementById("sides").value);
  if (polygon) polygon.canvas.remove();
  polygon = luca.insertPolygon({
    canvasWidth: width,
    canvasHeight: height,
    fill: fill,
    sides: sides,
    [key]: value,
    rotation: rotation,
    where: document.getElementById('polygon'),
    onclick: function() {
      alert('I was clicked! D:');
    },
    onmouseover: function() {
      this.canvas.style.cursor = 'pointer';
    },
    onmouseout: function() {
      this.canvas.style.cursor = '';
    }
  });
}

var img = luca.createHTMLImageElement('https://misanimales.com/wp-content/uploads/2015/02/elefante.jpg');
var polygon;
addEventListener("load", onChange);
addEventListener("change", onChange);