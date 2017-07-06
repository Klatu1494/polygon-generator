# Luca's polygon generator library

## How to use

1. Call luca-regular-polygon-generator.js from your HTML code.
2. Call luca.insertPolygon to insert a regular polygon.

## luca.insertPolygon syntax

```javascript
luca.insertPolygon(options);
```

where options is an object with the following properties:

+ canvasHeight (defaults to fit the polygon's height): the polygon is drawn in a <canvas> whose height will be this number (this number must be positive)
+ canvasWidth (defaults to fit the polygon's width): the polygon is drawn in a <canvas> whose width will be this number (this number must be positive)
+ fill (defaults to "black"): the CSS color value, image or gradient that will fill the polygon
+ rotation (defaults to 0): the rotation angle of the polygon, in a clockwise direction (if the rotation property is 0, one of the hexagon's corners will be pointing to the rigth)
+ radius (required unless you specify the sideLength property): the distance between the polygon's center and its corners (overrides the sideLength property if both are specified)
+ sideLength (required unless you specify the radius property): the distance between a corner and the nearest corners
+ sides (defaults to 3): the number of sides of the polygon
+ HTMLElement where (defaults to document.body): the polygon's parent element