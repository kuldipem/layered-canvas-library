# Canvas #

Canvas is a singleton class. It also acts as the name space for everything else.

# Properties #

_Private_ **String version** The current version of the library.

_Private_ **String elID** The id of the Canvas element.

_Private_ **DOMElement el** The DOM reference to the Canvas element.

_Private_ **DOMCanvasContext elCtx** The DOMCanvasContext of the Canvas element.

_Private_ **Integer x** The current X position of the Canvas element.

_Private_ **Integer y** The current Y position of the Canvas element.

# Methods #

_Private_ **getEl()** Returns the DOM reference to the Canvas element.

_Private_ **setEl(String elID, String dimension `[optional]`)** Finds the Canvas element by the string identifier elID, and saves it to the Canvas object. If dimension is set, it will set the DOMCanvasContext of the Canvas element. This method also sets up the fireEvent handler.

_Private_ **setCtx(String dimension, Bool returnContext `[optional]`)** Sets the DOMCanvasContext to the Canvas element. If returnContext is set to true, it will return the DOMCanvasContext.

_Private_ **getCtx(String dimension `[optional]`)** Gets the DOMCanvasContext of the Canvas element. If dimension is set, the method will set the DOMCanvasContext to the new dimension and return the new DOMCanvasContext.

_Private_ **fireEvent(DOMEvent event)** Handles events that have been fired. This also triggers events on objects that are listening for those events to be fired.

_Private_ **clear()** Fills the canvas with a clear rectangle. The width and height of the Canvas object must be set for this to work.

_Private_ **toString()** Returns the string, `"[Canvas]"`.

_Private_ **valueOf()** Returns the string, `"[Canvas]"`.

# Example #
Assuming that there is a Canvas element with the ID, "canvas".
```
// Set the Canvas element. This step must be done before any drawing is done.
Canvas.setEl("canvas", "2d");

// We can access the Canvas Context directly from the Canvas element.
Canvas.getCtx().fillStyle = "rgb(255, 0, 255)";
Canvas.getCtx().fillRect(0, 0, 100, 100);
```