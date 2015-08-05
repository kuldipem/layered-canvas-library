# Canvas.Item #

An Item is essentially an object that is stored within a Layer. The item implements it's own draw function, but is able, and intended to be drawn from within the [Layer](http://code.google.com/p/layered-canvas-library/wiki/Layer) or [LayerManager](http://code.google.com/p/layered-canvas-library/wiki/LayerManager).

# Canvas.Item.constructor #

The Item constructor takes a complex object, and optionally the [Layer](http://code.google.com/p/layered-canvas-library/wiki/Layer) it should be added to. It returns the constructed Item. At the constructor method simple error checking takes place to verify that no two Item's have the same ID.

The constructed object is automatically added to the [ObjectManager](http://code.google.com/p/layered-canvas-library/wiki/ObjectManager).

## Object Parameters ##

_Public_ **String id**
The string identifier of the object.

_Public_ **Integer x**
The x coordinate of the object. This must be set if the Item listens for mouse events.

_Public_ **Integer y**
The y coordinate of the object. This must be set if the Item listens for mouse events.

_Public_ **Integer z**
The z coordinate of the object. Currently not used, but available for use in 3d objects.

_Public_ **Integer height**
The height of the object. This must be set if the Item listens for mouse events.

_Public_ **Integer width**
The width of the object. This must be set if the Item listens for mouse events.

_Public_ **Object on**
Defines a set of events to listen for. An Item can listen to the following events;

  * mouseover
  * mouseout
  * mouseup
  * mousedown
  * click
  * dblclick
  * keydown
  * keyup
  * keypress

Events should be defined as,
```
   on : {
      "eventName" : function (DOMEvent event, String type, DOMCanvasContext ctx, Item obj) {}
   }
```

_Private_ **[Layer](http://code.google.com/p/layered-canvas-library/wiki/Layer) layer**
The parent Layer of the object. This is automatically set by the library if the Item was created by use of a [Layer](http://code.google.com/p/layered-canvas-library/wiki/Layer) constructor.

_Private_ **[Canvas](http://code.google.com/p/layered-canvas-library/wiki/Canvas) superParent**
The super parent [Canvas](http://code.google.com/p/layered-canvas-library/wiki/Canvas)  object. This is automatically set by the library.

## Methods ##

_Public_ **getLayer()** Returns the Item's parent Layer, if it's set.

_Public_ **draw(DOMCanvasContext ctx)** This method is intended to be overridden by the user. If the draw method is called from the parent [Layer](http://code.google.com/p/layered-canvas-library/wiki/Layer) or [LayerManager](http://code.google.com/p/layered-canvas-library/wiki/LayerManager), the ctx variable will be set to the [Canvas](http://code.google.com/p/layered-canvas-library/wiki/Canvas) context.

_Public_ **getID()** Returns the Item's ID.

_Public_ **getX()** Returns the Item's X coordinate.

_Public_ **getY()** Returns the Item's Y coordinate.

_Public_ **getZ()** Returns the Item's Z coordinate.

_Public_ **hasEvent(String type)** Determines if the event 'type' has been defined, and if it is a function. If both are true it returns true.

_Public_ **getEvent(String type)** Searches for and returns the event defined at 'type'.

_Private_ **fireEvent(DOMEvent event, String type, DOMCanvasContext ctx, Item obj)** Private method invoked by the [ObjectManager](http://code.google.com/p/layered-canvas-library/wiki/ObjectManager) singleton class when the event is fired from the window.

_Private_ **toString()** Returns "`[Canvas.Item]`" for the window.

_Private_ **valueOf()** Returns "`[Canvas.Item]`" for the window.

# Example #

```
var block = new Canvas.Item({
   id : "block",
   x : 15,
   y : 15,
   width : 50,
   height : 50,
   // Store a custom variable for the color
   fillStyle : "rgb(0, 255, 0)",
   draw : function (ctx) {
      // If the item isn't drawn from the Layer, or LayerManager we have to
      // define our own context.
      if(typeof(ctx) == "undefined") {
         ctx = Canvas.getCtx();
      }
      // Set the fill style to our current fill style
      ctx.fillStyle = this.fillStyle;

      // Fill a rectangle using our x, y, width, and height properties.
      ctx.fillRect(this.x, this.y, this.width, this.height);
   },
   on : {
      // on mouseover, change the object's color and redraw
      "mouseover" : function (event, type, ctx, item) {
         item.fillStyle = "rgb(255, 0, 0)";
         item.draw(ctx);
      }
   }
});

item.draw(Canvas.getCtx());

```