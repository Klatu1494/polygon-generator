class LucaPoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class LucaSegment {
  constructor(p, q) {
    this.p = p;
    this.q = q;
  }
}

class LucaPolygon {
  constructor(pointsArray, canvas, options) {
    this.eventCallbacks = {};
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.containsMouse = false;
    this.segments = [];
    this.points = pointsArray;
    this.sides = options.sides;
    this.radius = options.radius;
    this.rotation = options.rotation;
    this.where = options.where;
    this.fill = options.fill;
    this.onmouseout = options.onmouseout;
    this.onmouseover = options.onmouseover;
    this.minX = pointsArray[0].x;
    this.maxX = pointsArray[0].x;
    this.minY = pointsArray[0].y;
    this.maxY = pointsArray[0].y;
    for (i = 1; i < pointsArray.length; i++) {
      if (pointsArray[i].x < this.minX) this.minX = pointsArray[i].x;
      if (pointsArray[i].y < this.minY) this.minY = pointsArray[i].y;
      if (this.maxX < pointsArray[i].x) this.maxX = pointsArray[i].x;
      if (this.maxY < pointsArray[i].y) this.maxY = pointsArray[i].y;
    }
    if (options.canvasHeight <= 0) {
      options.canvasHeight = Math.ceil(this.maxY - this.minY);
    }
    if (options.canvasWidth <= 0) {
      options.canvasWidth = Math.ceil(this.maxX - this.minX);
    }
    this.canvas.width = this.canvasWidth = options.canvasWidth;
    this.canvas.height = this.canvasHeight = options.canvasHeight;
    for (i = 0; i < pointsArray.length; i++) pointsArray[i] = new LucaPoint(pointsArray[i].x - this.minX, pointsArray[i].y - this.minY)
    for (var i = 0, j = pointsArray.length - 1; i < pointsArray.length; j = i++) this.segments.push(new LucaSegment(pointsArray[i], pointsArray[j]));
    this.onmousemove = (function(e) {
      if (this.contains(new LucaPoint(e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop))) {
        if (!this.containsMouse) {
          this.containsMouse = true;
          this.onmouseover();
        }
      } else if (this.containsMouse) {
        this.containsMouse = false;
        this.onmouseout();
      }
    }).bind(this);
    this.onclick = (function(e) {
      if (this.containsMouse) options.onclick.bind(this)();
    }).bind(this);
  }

  addEventListener(event, callback) {
    this.canvas.addEventListener(event, callback);
    this.eventCallbacks[event] ? this.eventCallbacks[event].push(callback) : this.eventCallbacks[event] = [callback];
  }

  //method based on substack's repo: https://github.com/substack/point-in-polygon
  contains(point) {
    var returnValue = false;
    for (var i = 0; i < this.segments.length; i++)
      if (((this.segments[i].p.y > point.y) != (this.segments[i].q.y > point.y)) && (point.x < (this.segments[i].q.x - this.segments[i].p.x) * (point.y - this.segments[i].p.y) / (this.segments[i].q.y - this.segments[i].p.y) + this.segments[i].p.x)) returnValue = !returnValue;
    return returnValue;
  }

  removeEventListener(events, callbacks) {
    var event, callback;
    if (events === 'all') {
      events = [];
      for (event in this.eventCallbacks) events.push(event);
    }
    if (typeof events === 'string') events = [events];
    if (!(events instanceof Array)) return;
    if (callbacks === 'all') {
      callbacks = [];
      for (event of events)
        for (callback of this.eventCallbacks[event]) callbacks.push(callback);
    }
    if (typeof callbacks === 'function') callback = [callback];
    if (!(callbacks instanceof Array)) return;
    for (event of events)
      for (callback of callbacks) this.canvas.removeEventListener(event, callback);
  }

  draw(options) {
    options = options || {};
    //declare variables
    var currentPoint;
    var firstPoint = this.points[0];
    var i;
    //validate input and set variables to default
    if (typeof options.fill === 'string' || options.fill instanceof HTMLImageElement) this.fill = options.fill;
    else if (!this.fill) this.fill = 'black';
    //fill the canvas with the appropriate color or image
    this.ctx.globalCompositeOperation = 'source-over';
    if (this.fill instanceof HTMLImageElement) this.ctx.drawImage(this.fill, 0, 0, this.canvasWidth, this.canvasHeight); //TODO: allow further customization
    else {
      this.ctx.fillStyle = this.fill;
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
    //clip the polygon
    this.ctx.globalCompositeOperation = 'destination-in';
    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].x, this.points[0].y);
    for (i = 1; i < this.points.length; i++) {
      currentPoint = this.points[i];
      this.ctx.lineTo(currentPoint.x, currentPoint.y);
    }
    this.ctx.fill();
  }
}

class Luca {
  createHTMLImageElement(path) {
    var img = new Image();
    img.src = path;
    return img;
  }

  //default of on* properties
  emptyFunction() {

  }

  insertPolygon(options) {
    var canvas, i, points, polygon;
    //validate input and set variables to default when possible
    if (!(options.where instanceof HTMLElement)) options.where = document.body;
    if (typeof options.sides !== 'number') options.sides = 3;
    if (typeof options.rotation === 'number') options.rotation = options.rotation * Math.PI / 180;
    else options.rotation = 0;
    if (typeof options.radius !== 'number') {
      if (typeof options.sideLength === 'number') options.radius = options.sideLength / (2 * Math.sin(Math.PI / options.sides));
      else throw new Error('You did not specify a radius or a side length.');
    }
    if (typeof options.canvasWidth !== 'number') options.canvasWidth = 0;
    if (typeof options.canvasHeight !== 'number') options.canvasHeight = 0;
    if (typeof options.onmouseover !== 'function') options.onmouseover = this.emptyFunction;
    if (typeof options.onmouseout !== 'function') options.onmouseout = this.emptyFunction;
    if (typeof options.onclick !== 'function') options.onclick = this.emptyFunction;
    //set up the canvas
    canvas = document.createElement('canvas');
    //create an object which represents the polygon
    points = [];
    for (i = 0; i < options.sides; i++) points.push(new LucaPoint(
      Math.cos(options.rotation + Math.PI * 2 * i / options.sides) * options.radius,
      Math.sin(options.rotation + Math.PI * 2 * i / options.sides) * options.radius
    ));
    polygon = new LucaPolygon(points, canvas, options);
    //add event listeners
    polygon.addEventListener('mousemove', polygon.onmousemove);
    polygon.addEventListener('click', polygon.onclick);
    //append the canvas to the desired element
    polygon.where.appendChild(canvas);
    //draw the polygon
    polygon.draw(options);
    return polygon;
  }
}

var luca = new Luca();