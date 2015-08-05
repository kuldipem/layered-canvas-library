# Canvas.LayerManager #

LayerManager is a singleton class that manages Layers as well as Items within lay within the Layers. You access it simply by invoking it's name, and methods. Canvas.LayerManager.findLayer("layerID"); for example.

## Properties ##

_Private_ **Array Layers** An array that contains the Layers that the LayerManager manages.

## Methods ##

_Private_ **draw(DOMCanvasContext ctx)** This method fires the draw function of each Layer it manages, which in turn fires the draw method on each Item, the Layers contain.

_Private_ **findLayer(String layerID)** Finds a Layer by the string identifier layerID, then returns it.

_Private_ **findItem(String itemID, String layerID `[optional]`)** Finds an Item by the string identifier itemID, and returns it.

_Private_ **findLayerPosition(String layerID)** Finds a Layer by the string identifier layerID, then returns it's position.

_Private_ **getLayerAt(Integer position)** Finds a Layer by at it's position and returns it.

_Private_ **addLayer(Object layer, Bool isLayer `[optional]`)** Adds a Layer to to the LayerManager. The layer parameter can be a complex object that is a Layer template, or a constructed Layer. If it is a constructed Layer isLayer must be set to true.

_Private_ **promoteLayer(String layerID)** Finds a Layer by the string identifier layerID, then adjusts it's order so that it is drawn after other Layers. Here is an example;

layers : `[layera, layerb, layerc]`;

promote(layera);

layers : `[layerb, layera, layerc]`;

_Private_ **demoteLayer(String layerID)** Finds a Layer by the string identifier layerID, then adjusts it's order so that it is drawn before other Layers. See promoteLayer as an example... except reverse.

_Private_ **moveLayerTo(String layerID, Integer position)** Finds a Layer by the string identifier layerID, then moves it to the specified position.

_Private_ **removeLayer(String layerID)** Finds a Layer by the string identifier layerID, and removes it. Note: this will also remove the Layers Items.

_Private_ **toString()** Returns a list of all the Layers the LayerManager is managing.

# Example #
```
// Create a couple of layers
var rocks = new Canvas.Layer({
   id : "rocks",
   items : []
});

var trees = new Canvas.Layer({
   id : "trees",
   items : []
});

// Draw out only the rocks layer
Cavas.LayerManager.findLayer("rocks").draw(Canvas.getCtx());

// Draw out only the trees layer
Canvas.LayerManager.findLayer("trees").draw(Canvas.getCtx());

// Draw out both layers. The order it will draw out, is the same as the order it was
// created. Unless you promote, demote or move some layers around.

Canvas.LayerManager.draw();
```