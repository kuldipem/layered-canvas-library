# Canvas.Layer #

Canvas.Layer is a manager for Items. It contains methods that deal exclusively with the objects that it manager. Canvas.Layer implements it's own private draw method, that fires the draw method on all of the Item(s) it manages.

# Canavas.Layer.constructor #

The Layer constructor takes two paramters, a complex Item object, and optionally the LayerManager singleton class. It returns the constructed Layer. At constructor method, simple error checking takes place to validate that it's id is unique within the LayerManager. The constructor will also create Item's that are passed through in the complex object parameter.

The constructed object is automatically added to the ObjectManager and the LayerManager.

## Object Parameters ##

_Public_ **String id** The string identifier of the layer.

_Public_ **Array items** An array of objects that describe Items to be created at construct.

_Public_ **Object on** Defines a set of events to listen for. A Layer can listen to the following events;

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
      "eventName" : function (DOMEvent event, String type, DOMCanvasContext ctx, Layer obj) {}
   }
```
_Private_ **Canvas parent** Reference to the Canvas object.

## Methods ##

_Private_ **draw(DOMCanvasContext ctx)** Iterates through all the Item's the Layer is managing and fire's their draw method.

_Private_ **getCount()** Returns the number of Item's the Layer is managing.

_Private_ **getID()** Returns the string identifier of the Layer.

_Private_ **addItem(Object item, Bool returnItem)** Add's an Item to the Layer. If returnItem is set to true, it will return the constructed Item.

_Private_ **getItem(String itemID)** Finds, and returns the Item with the string identifier, itemID.

_Private_ **getItemAt(Integer position)** Returns the Item at position.

_Private_ **findItem(String itemID)** Finds an Item with the string identifier, itemID, then returns it's position.

_Private_ **promoteItem(String itemID)** Finds an Item with the string identifier, itemID, then adjusts the position of the Item within the managed array to be higher in the order.

Here is an example;
items : [itema, itemb, itemc]

promoteItem(itema);

items become;
items: [itemb, itema, itemc]

This will cause itemb to be drawn first, then a, then c. You are promoting the Item closer to last Item drawn, or the top most Item seen.

_Private_ **demoteItem(String itemID)** Finds an Item with the string identifier, itemID, then adjusts the position of the Item within the managed array to be lower in the order. See the example listed above... except in reverse.

_Private_ **moveItemTo(String itemID, Integer position)** Finds an Item with the string identifier, itemID, then adjusts it's position to match position.

_Private_ **removeItem(String itemID)** Finds an Item with the string identifier, itemID, then removes it.

_Private_ **removeAllItems()** Removes all the items within the Layer.

_Private_ **hasEvent(String type)** Determines if the event 'type' has been defined, and if it is a function. If both are true it returns true.

_Private_ **getEvent(String type)** Searches for and returns the event defined at 'type'.

_Private_ **fireEvent(DOMEvent event, String type, DOMCanvasContext ctx, Item obj) Private method invoked by the ObjectManager singleton class when the event is fired from the window.**

# Example #

```
// Create a layer that contains three blocks. A red, green, and blue one.
// Draw the blocks in such a way, so that they overlap.
var layer = new Canvas.Layer({
   id : "blocks",
   items : [{
      id : "redBlock",
      draw : function (ctx) {
         ctx.fillStyle = "rgba(255, 0, 0, 50)";
         ctx.fillRect(20, 20, 50, 50);
      }
   },{
      id : "greenBlock",
      draw : function (ctx) {
         ctx.fillStyle = "rgba(0, 255, 0, 50)";
         ctx.fillRect(60, 20, 50, 50);
      }
   },{
      id : "blueBlock",
      draw : function (ctx) {
         ctx.fillStyle = "rgba(0, 0, 255, 50)";
         ctx.fillRect(100, 20, 50, 50);
      }
   }]
});
// Draw out the items
layer.draw(Canvas.getCtx());

// You can also draw this using the LayerManager
// Canvas.LayerManager.draw();
```