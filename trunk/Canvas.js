/**
 * @author Michael Camden
 */

(function () {
	
	/**
	 * The base library. This is a singleton class that cannot be created.
	 */
	var Canvas = this.Canvas = {
		/**
		 * @var version {Float} Stores the current version
		 */
		version : 1.5,
		/**
		 * @var author {String} Stores the library author
		 */
		author : "Michael Camden",
		/**
		 * @var elID {String} Stores the DOM ID of the Canvas Element
		 */
		elID : "",
		/**
		 * @var el {Object} Stores the DOM element 
		 */
		el : null,
		
		/**
		 * @var elCtx {Object} The context from the DOM Canvas
		 */
		elCtx : null,
		
		/**
		 * @var x {Int} The current X position of the Canvas
		 */
		x : 0,
		
		/**
		 * @var y {Int} The current Y position of the Canvas
		 */
		y : 0,
		/**
		 * Returns the DOM element or false
		 */		
		getEl : function () {
			if (this.el != null && typeof(this.el) != "undefined") {
				return this.el;
			}
			else {
				return false;
			}
		},
		
		/**
		 * Sets this.el and this.elID params. Takes a string or DOM object
		 * @param {Object} elID
		 */		
		setEl : function (elID, dimension) {
			if(typeof(elID) == "string") {
				var _el = document.getElementById(elID);
				if(_el != null && _el.tagName == "CANVAS") {
					this.el = _el;
					this.elID = elID;
					
					// Set the context of the element if dimension is set
					if(typeof(dimension) != "undefined") {
						this.setCtx(dimension);
					}
				}
			} else if(typeof(elID) == "object") {
				if(elID.tagName && elID.tagName == "CANVAS") {
					this.el = elID;
					this.elID = elID.id || "__canvas";
					
					// Set the context of the element if dimension is set
					if(typeof(dimension) != "undefined") {
						this.setCtx(dimension);
					}
				}
			} else {
				// Throw debug message
				Canvas.util.debug("elID not proper object, or string.");
			}
			if(this.el == null || typeof(this.el) == "undefined") {
				return false;
			}
			
			// Now that we have the object, attach some event listeners to it
			
			// Mouse Events
			this.el.onmousemove = this.fireEvent;
			this.el.onclick = this.fireEvent;
			this.el.ondblclick = this.fireEvent
			this.el.onmousedown = this.fireEvent;
			this.el.onmouseup = this.fireEvent;
			
			// Keyboard Events are attached at the window
			window.onkeydown = this.fireEvent;
			window.onkeyup = this.fireEvent;
			window.onkeypress = this.fireEvent;
			
			// Find the position of the Canvas element
			var position = Canvas.util.findPos(this.el);
			this.x = position[0];
			this.y = position[1];

			return true;
		},
		
		/**
		 * Sets the context of the Canvas el and returns if asked
		 * @param {String} dimension
		 * @param {Bool} returnContext
		 */	
		setCtx: function (dimension, returnContext) {
			if(typeof(this.el) != "undefined" && this.el != null) {
				var _d = dimension || "2d";
				if (returnContext) {
					this.elCtx = this.el.getContext(_d);
					return this.elCtx;
				}
				else {
					this.elCtx = this.el.getContext(_d);
					return true;
				}
			} else {
				Canvas.util.debug("Canvas Element not set properly");
			}
			return false;
		},
		
		/**
		 * Returns the context of the Canvas el, sets if it not set and dimension is set
		 * @param {String} dimension
		 */		
		getCtx : function (dimension) {
			if (typeof(this.elCtx) != "undefined" && this.elCtx != null) {
				return this.elCtx;
			}
			else {
				return this.setCtx(dimension, true);
			}
		},
		/**
		 * Handles events that have been fired. This also triggers events
		 * on objects that are listening for those events to be fired.
		 * @param {Object} event
		 */
		fireEvent : function (event) {
			var canvas = Canvas;
			var type = "N/A";
			if(typeof(event.type) != "undefined") {
				type = event.type;
			}
			if(typeof(canvas) == "undefined") {
				Canvas.util.debug("Canvas::fireEvent; Can't find canvas");
				return false;
			}
			// Adjust mouseX and Y with the current X and Y of the canvas.
			// This will give us a closer approximation of the x and y of 
			// the mouse, over the canvas
			var mouseX = parseInt(event.clientX) - parseInt(canvas.x);
			var mouseY = parseInt(event.clientY) - parseInt(canvas.y);
			event.mouseX = mouseX;
			event.mouseY = mouseY;
			
			// This is a buffer for mouse events. Since each mouse event
			// should be a singular event. So, if this buffer has more then one
			// element, it should only fire the last element.
			var mouseEventsToFire = new Array();
			
			// mouse events to catch
			var mouseEvents = new Array("click", "dblclick", "mousemove", "mouseover", "mousedown", "mouseup");
			
			for(i in canvas.ObjectManager.objects) {
				var obj = canvas.ObjectManager.objects[i].object;
				
				// Determine if it's a mouse move event, if so determine if
				// we move over the obj. If so, fire the mouseover event.
				// If we are moving off of the obj, then fire the mouseoff event
				
				if(Canvas.util.isOverObj(mouseX, mouseY, obj) && type == "mousemove" && typeof(obj._mouseover) == "undefined") {
					obj._mouseover = true;
					if (obj.hasEvent("mouseover")) {
						obj.fireEvent(event, "mouseover", canvas.getCtx(), obj);
					}
				}
				else if (!Canvas.util.isOverObj(mouseX, mouseY, obj) && type == "mousemove" && typeof(obj._mouseover) == "boolean") {
					delete(obj._mouseover);
					if (obj.hasEvent("mouseout")) {
						obj.fireEvent(event, "mouseout", canvas.getCtx(), obj);
					}
				}
				// If over the obj, and mousedown on the obj
				if(Canvas.util.isOverObj(mouseX, mouseY, obj) && type == "mousedown" && typeof(obj._isDraggable) == "undefined") {
					obj._isDraggable = true;
					obj.canDrag = true;
				} else if (!Canvas.util.isOverObj(mouseX, mouseY, obj) && type == "mouseup" && typeof(obj._isDraggable) == "boolean") {
					delete(obj._isDraggable);
					obj.canDrag = false;
				}
				
				if(obj.hasEvent(type)) {
					// On mouse events, calculate the position of the mouse 
					// in relation to the canvas, and the position of the mouse
					// in relation to each object drawn					
					if(mouseEvents.toString().search(type) !== -1) {
						if (Canvas.util.isOverObj(mouseX, mouseY, obj)) {
							obj.fireEvent(event, type, canvas.getCtx(), obj);
						}
					// Keyboard events	
					} else {	
						obj.fireEvent(event, type, canvas.getCtx(), obj);
					}
				}
			}
			return true;
		},		
		// Native, req functions //
		/**
		 * Returns the name of the Obj
		 */
		toString : function () {
			return "[Canvas]";
		},
		
		/**
		 * Same as toString
		 */
		valueOf : function () {
			return "[Canvas]";
		}
	};
	

	/**
	 * A set of utility functions that help in all areas of the library 
	 */
	Canvas.util = Canvas.prototype = {
		/**
		 * Combines two json objects, obj1 is the default values, obj2 is the passed values
		 * @param {Object} obj1
		 * @param {Object} obj2
		 */
		combine : function (obj1, obj2) {
			var obj = {};
			
			// Iterate through defaults, append and replace those it has
			for(i in obj1) {
				if(typeof(obj2[i]) != "undefined") {
					obj[i] = obj2[i];
				} else {
					obj[i] = obj1[i];
				}
			}
			// Iterate through passed objs, append them to the final object
			for(i in obj2) {
				if(typeof(obj[i]) == "undefined") {
					obj[i] = obj2[i];
				}
			}
			
			return obj;
		},
		// debugging (firebug) //
		/**
		 * Echo's a message to window.console (firebug)
		 * @param {Object} message
		 */
		debug : function (message) {
			if (window.console) {
				window.console.log(message);
				return true;
			}
			else {
				return false;
			}
		},
		/**
		 * http://www.quirksmode.org/js/findpos.html
		 * @param {DOM} obj
		 */
		findPos : function (obj) {
			var curLeft = curTop = 0;
			if(obj.offsetParent) {
				do {
					curLeft += obj.offsetLeft;
					curTop += obj.offsetTop;
				} while (obj = obj.offsetParent);	
			}
			return [curLeft, curTop];
		},
		/**
		 * Determines if the mouseX and Y are over the obj
		 * @param {Int} mouseX
		 * @param {Int} mouseY
		 * @param {Object} obj
		 */
		isOverObj : function (mouseX, mouseY, obj) {
			// If the object can be tracked..
			if(typeof(obj.width) == "undefined" || typeof(obj.height) == "undefined" ||
				typeof(obj.x) == "undefined" || typeof(obj.y) == "undefined" ) {
				return false;
			}						
			// If the mouse is within the object's dimensions, then return true
			if(mouseX >= obj.x && mouseX <= (obj.x + obj.width)) {
				if(mouseY >= obj.y && mouseY <= (obj.y + obj.height)) {
					return true;
				}
			}
		}
	};

	Canvas.ObjectManager = Canvas.prototype = {
		/**
		 * Array of objects, stores the objectID and type
		 */
		objects: [],
		/**
		 * Attempts to add an object to the array. If the object exists, it will return false. Otherwise true.
		 * @param {String} objectID
		 * @param {String} type
		 * @param {Object} object
		 */
		addObject : function (objectID, type, object) {
			if(typeof(objectID) == "undefined") {
				Canvas.util.debug("ObjectManager::addObject; objectID is not defined");
				return false;
			}
			if(typeof(type) == "undefined") {
				Canvas.util.debug("ObjectManager::addObject; type is not defined");
				return false;
			}
			if(typeof(object) == "undefined") {
				Canvas.util.debug("ObjectManager::addObject; object is not defined");
				return false;
			}
			if(this.findObject(objectID, type) === false) {
				this.objects.push({
					objectType : type,
					objectID : objectID,
					object : object
				});
				return true;
			} else {
				Canvas.util.debug("ObjectManager::addObject; object already exists");
				return false;
			}
		},
		/**
		 * Attempts to remove an object from within the array. Returns true or false
		 * @param {String} objectID
		 * @param {String} type
		 */
		removeObject : function (objectID, type) {
			if(typeof(objectID) == "undefined") {
				Canvas.util.debug("ObjectManager::removeObject; objectID is not defined");
				return false;
			}
			if(typeof(type) == "undefined") {
				Canvas.util.debug("ObjectManager::removeObject; type is not defined");
				return false;
			}
			var obj = this.findObject(objectID, type);
			if(obj !== false) {
				var newObjects = this.objects.splice(obj.objectAt, 1);
				this.objects = newObjects;
				return true;
			} else {
				return false;
			}
			
		},
		/**
		 * Attempts to find an object within the object's array. Returns a complex object, or false
		 * @param {String} objectID
		 * @param {String} type
		 */
		findObject : function (objectID, type) {
			if(typeof(this.objects) == "undefined") {
				Canvas.util.debug("ObjectManager::findObject; objects is undefined");
				return false;
			}
			if(typeof(this.objects) != "undefined" && !(this.objects instanceof Array)) {
				Canvas.util.debug("ObjectManager::findObject; objects is not an array");
				return false;
			}
			if(typeof(objectID) == "undefined") {
				Canvas.util.debug("ObjectManager::findObject; objectID is not defined");
				return false;
			}
			if(typeof(type) == "undefined") {
				Canvas.util.debug("ObjectManager::findObject; type is not defined");
				return false;
			}
			for(i in this.objects) {
				if(this.objects[i].type == type && this.objects[i].objectID == objectID) {
					var returnObject = {
						objectAt : i,
						objectID : objectID,
						objectType : objectType,
						object : i.object
					};
					return returnObject;
				}
			}
			return false;
		}
	};

	/**
	 * Control's and manage's Layers. 
	 */	
	Canvas.LayerManager = Canvas.prototype = {		
		/**
		 * Array of layers (Layer) that are stored with in the layer manager
		 * @see Canvas.Layer
		 */
		layers : [],
		
		/**
		 * Returns the count of layers
		 */
		getCount : function () {
			return this.layers.length;
		},
		draw : function (ctx) {
			// If ctx is undefined, then grab the context from the parent
			if(typeof(ctx) == "undefined") {
				ctx = this.getCtx();
			}
			// If ctx is still undefined, then throw an error
			if(typeof(ctx) == "undefined") {
				Canvas.util.debug("Canvas::LayerManager ctx is undefined");
				return false;
			}
			// Gotta have some layers to draw in
			if(typeof(this.layers) == "undefined") {
				Canvas.util.debug("Canvas::LayerManager layers is undefined")
			}
			// Gotta be an array of layers
			if(typeof(this.layers) != "undefined" && !(this.layers instanceof Array) ) {
				Canvas.util.debug("Canvas::LayerManager layers is not an array");
				return false;
			}
			// No really... gotta have some layers to draw in
			if(this.layers.length < 1) {
				Canvas.util.debug("Canvas::LayerManager no layers to draw on");
				return false;
			}
			// Otherwise...
			for(i in this.layers) {
				if(typeof(this.layers[i].draw) == "function") {
					this.layers[i].draw(ctx);
				}
			}
			return true;
		},
		/**
		 * Finds a Layer by it's ID
		 * @param {String} layerID
		 */
		findLayer : function (layerID) {
			if(typeof(layerID) == "undefined") {
				Canvas.util.debug("LayerManager::findLayer; layerID is undefined");
				return false;
			}
			if(typeof(this.layers) == "undefined" || !(this.layers instanceof Array)) {
				Canvas.util.debug("LayerManager::findLayer; no layers defined");
				return false;
			}
			for(i in this.layers) {
				var layer = this.getLayerAt(i);
				if(layer.getID() == layerID) {
					return layer;
				}
				return false;
			}
		},
		/**
		 * Returns the layer at position
		 * @param {Int} position
		 */
		getLayerAt : function (position) {
			if(typeof(position) == "undefined") {
				Canvas.util.debug("LayerManager::getLayerAt; position is undefined");
				return false;
			}
			if(typeof(this.layers[position]) == "undefined") {
				Canvas.util.debug("LayerManager::getLayerAt; no layer at position");
				return false;
			}
			return this.layers[position];
		},
		/**
		 * Adds a new Layer to the Layer Manager
		 * @param {Canvas.Layer} layer
		 */
		addLayer : function (layer) {
			if(typeof(layer) == "undefined") {
				Canvas.util.debug("LayerManager::addLayer; layer is undefined");
				return false;
			}
			// Accepts array of layers
			if (typeof(layer) == "array") {
				for (i in layer) {
					this.layers.push(new Canvas.Layer(layer[i], this));
				}
			}
			else {
				this.layers.push(new Canvas.Layer(layer, this));
			}
		},
		/**
		 * Moves a layer to higher in the order, or closer to the top of the Canvas
		 * @param {String} layerID
		 */
		promoteLayer : function (layerID) {
			if (typeof(layerID) == "undefined") {
				Canvas.util.debug("Layer::promoteLayer; layerID is undefined");
				return false;
			}
			
			var layerPosition = this.findLayer(layerID);
			var newPosition = parseInt(layerPosition) - 1;
			
			return this.moveLayerTo(layerID, newPosition);

		},
		/**
		 * Moves a layer to lower in the order, or closer to the botom of the Canvas
		 * @param {Object} layerID
		 */
		demoteLayer : function (layerID) {
			if(typeof(layerID) == "undefined") {
				Canvas.util.debug("Layer::promoteLayer; layerID is undefined");
				return false;
			}
			
			var layerPosition = this.findLayer(layerID);
			var newPosition = parseInt(layerPosition) - 1;
			
			return this.moveLayerTo(layerID, newPosition);
			
		},
		/**
		 * Moves a layer to the designated position
		 * @param {String} layerID
		 * @param {Int} position
		 */
		moveLayerTo : function (layerID, position) {
			if(typeof(layerID) == "undefined") {
				Canvas.util.debug("LayerManager::moveLayerTo; layerID is undefined");
				return false;
			}
			if(typeof(position) == "undefined") {
				Canvas.util.debug("LayerManager::moveLayerTo; position is undefined");
				return false;
			}
			if (position < 0) {
				position = 0;
			}
			if (position > (this.getCount() - 1)) {
				position = (this.getCount() - 1);
			}
			
			var layerPosition = this.findLayer(layerID);
			
			if(layerPosition === false) {
				// Debug message will be thrown by findLayer
				return false;
			}
			
			var layer = new Object;
			var oldLayers = this.items;
			var newLayers = new Array();
			layer = oldLayers.splice(layerPosition, 1);
			layer = layer[0];					
			
			for(var i = 0;i <= (this.getCount());i++) {
				if (i != position) {
					newlayers.push(oldlayers[i]);
				}
				else {
					newlayers.push(layer);
				}
			}
			this.layers = newlayers;
			return true;	
		}
	};
	
	/**
	 * @see Canvas.Layer
	 * @param {Object} layer
	 * @param {Object} lm
	 */
	Canvas.Layer = Canvas.prototype = function (layer, lm) {
		var parent = Canvas;
		var defaultLayer = {
			/**
			 * @var id {String} The string identifier of the layer
			 */
			id : "layer_id",
			/**
			 * @var parent {Object} Reference to the parent obj
			 */
			parent : parent,
			/**
			 * @var items {Array} The array of items stored in the layer
			 */
			items: [],
			/**
			 * The layer constructor, returns the combined layer as well
			 * as does some error checking against the passed layer json
			 * object. You can optionally pass the layer manager, this will
			 * activate the no conflict id check.
			 * @param {Object} layer
			 * @param {Object} lm [optional]
			 */
			init : function (layer, lm) {
				if(typeof(layer) == "undefined") {
					Canvas.util.debug("Layer::init; layer is undefined");
					return false;
				}
				// If items is defined in the new layer, then add them
				// as a new Item obj to the layer before returning it
				if(typeof(layer.items) != "undefined" && (layer.items instanceof Array)) {
					// Having items in the definition prevents the new items from being created, and added properly
					var items = layer.items;
					delete(layer.items);
					
					for(i in items) {
						this.addItem(items[i], false);
					}
				}
				
				
				this.id = typeof(layer.id) != "undefined" ? layer.id : this.id; 
				
				// If adding a new layer by the layer manager...
				if(typeof(lm) != "undefined") {
					// If the layer.ID conflicts with another layer, append a "_" to the end of it 
					while(lm.findLayer(this.id) !== false) {
						this.id += "_";
					}
				}
				
				// Combine the object's default values with the passed values
				var combinedLayer = Canvas.util.combine(this, layer); 
				
				// Save object in the ObjectManager
				this.parent.ObjectManager.addObject(combinedLayer.id, "Layer", combinedLayer);
				
				// Returns the combined object
				return combinedLayer;
			},
			on : {
				// mousemove
				// mouseover
				// mouseoff
				// click
				// dblclick
			},
			/**
			 * Top level draw function. Excutes the draw functions of all items
			 * @param {Object} ctx
			 */
			draw : function (ctx) {
				// If ctx is undefined, define it using getCtx from the parent
				if(typeof(ctx) == "undefined")
					ctx = this.parent.getCtx();
				// If it's still undefined, then you're done
				if(typeof(ctx) == "undefined") {
					Canvas.util.debug("Layer::draw; ctx is undefined");
					return false;
				}
				
				// If the layer items is undefined
				if(typeof(this.items) == "undefined") {
					Canvas.util.debug("Layer::draw; Layer::items is undefined");
					return false;
				}
				// If the items are defined, but not an array
				if(typeof(this.items) != undefined && !(this.items instanceof Array)) {
					Canvas.util.debug("Layer::draw; Layer::items is not an array");
					return false;
				}
				// Execute all draw functions of the items in it's list
				for(i in this.items) {
					if(typeof(this.items[i].draw) == "function") {
						this.items[i].draw(ctx);
					}
				}
				return true;
			},
			/**
			 * Returns the count of items within the Layer object. Will return 0 if there is an error
			 * returns int
			 */
			getCount : function () {
				if(typeof(this.items) == "undefined") {
					Canvas.util.debug("Layer::getCount; Layer::items is undefined");
					return 0;
				}
				if(typeof(this.items) != "undefined" && !(this.items instanceof Array)) {
					Canvas.util.debug("Layer::getCount; Layer::items is not array");
					return 0;
				}
				return this.items.length;
			},
			/**
			 * Returns the layer ID
			 */
			getID : function () {
				return this.id;
			},
			/**
			 * Adds an item to the Layer items list. If returnItem is set to true, the item will be returned
			 * otherwise it will return a bool.
			 * @param {Object} item
			 * @param {Bool} returnItem
			 */
			addItem : function (item, returnItem) {
				if(typeof(item) != "object") {
					Canvas.util.debug("Layer::addItem; item is not an object");
					return false;
				}
				var newItem = new Canvas.Item(item, this);
				
				this.items[this.getCount()] = newItem;
									
				if(returnItem) {
					return newItem;
				}
				return true;
			},
			/**
			 * Get's the item with the id, itemID
			 * @param {String} itemID
			 */
			getItem : function (itemID) {
				if(typeof(itemID) == "undefined") {
					Canvas.util.debug("Layer::getItem; itemID is undefined");
					return false;
				}
				return this.items[this.findItem(itemID)];
			},
			/**
			 * Get's the item at position
			 * @param {Int} position
			 */
			getItemAt : function (position) {
				if(typeof(position) == "undefined") {
					Canvas.util.debug("Layer::getItemAt; position is undefined");
					return false;
				}
				if (typeof(this.items[position]) != "undefined") {
					return this.items[position];
				}
				else {
					return false;
				}
			},
			/**
			 * Find's the item with the ID, itemID
			 * @param {String} itemID
			 */
			findItem : function (itemID) {
				if(typeof(itemID) == "undefined") {
					Canvas.util.debug("Layer::findItem; itemID is undefined");
					return false;
				}
				if(typeof(this.items) == "object" && (this.items instanceof Array)) {
					for(i in this.items) {
						if(this.items[i].getID() == itemID) {
							return i;
						}  							
					}
					return false;
				}					
			},
			/**
			 * Moves an item closer to the front of the Canvas
			 * @param {String} itemID
			 */
			promoteItem : function (itemID) {
				if(typeof(itemID) == "undefined") {
					Canvas.util.debug("Layer::promoteItem; itemID is undefined");
					return false;
				}
				
				var itemPosition = this.findItem(itemID);
				var newPosition = parseInt(itemPosition) + 1;
				
				return this.moveItemTo(itemID, newPosition);
			},
			/**
			 * Moves an item closer to the back of the Canvas
			 * @param {String} itemID
			 */
			demoteItem : function (itemID) {
				if(typeof(itemID) == "undefined") {
					Canvas.util.debug("Layer::demoteItem; itemID is undefined");
					return false;
				}
				
				var itemPosition = this.findItem(itemID);
				var newPosition = parseInt(itemPosition) - 1;
				
				return this.moveItemTo(itemID, newPosition);					
			},
			/**
			 * Moves an item to the positions specified
			 * @param {String} itemID
			 * @param {Int} position
			 */
			moveItemTo : function (itemID, position) {
				if(typeof(itemID) == "undefined") {
					Canvas.util.debug("Layer::moveItem; itemID is undefined");
					return false;
				}
				if(typeof(position) == "undefined") {
					Canvas.util.debug("Layer::moveItem; position is undefined");
					return false;
				}
				if (position < 0) {
					position = 0;
				}
				if (position > (this.getCount() - 1)) {
					position = (this.getCount() - 1);
				}
				
				var itemPosition = this.findItem(itemID);
				
				if(itemPosition === false) {
					// Debug message will be thrown by findItem
					return false;
				}
				
				var item = new Object;
				var oldItems = this.items;
				var newItems = new Array();
				item = oldItems.splice(itemPosition, 1);
				item = item[0];					
				
				for(var i = 0;i <= (this.getCount());i++) {
					if (i != position) {
						newItems.push(oldItems[i]);
					}
					else {
						newItems.push(item);
					}
				}
				this.items = newItems;
				return true;
			},
			/**
			 * Removes an item from the Layer
			 * @param {String} itemID
			 */
			removeItem : function (itemID) {
				if(typeof(itemID) == "undefined") {
					Canvas.util.debug("Layer::remoteItem; itemID is undefined");
					return false;
				}
				var itemPosition = false;
				if((itemPosition = this.findItem(itemID)) !== false) {
					this.items.splice(itemPosition, 1);
					return true;
				} else {
					Canvas.util.debug("Layer:removeItem; unable to find itemID in items");
					return false;
				}
			},
			/**
			 * Determines if the event 'type' has been defined, and if it
			 * is a function. If both are true it returns true, false
			 * otherwise
			 * @param {String} type
			 * @return {Bool}
			 */
			hasEvent : function (type) {
				if(typeof(type) == "undefined") {
					Canvas.util.debug("Layer::hasEvent; type is not defined");
					return false;
				}
				if(typeof(this.on) != "undefined") {
					for(i in this.on) {
						if(i == type && typeof(this.on[i]) == "function") {
							return true;
						}
					}
				} else {
					return false;
				}
				return false;
			},
			/**
			 * Searches for and returns the event defined at 'type'.
			 * @param {String} type
			 * @return {Object}
			 */
			getEvent : function (type) {
				if(typeof(type) == "undefined") {
					Canvas.util.debug("Layer::getEvent; type is not defined");
					return false;
				}
				if(this.hasEvent(type)) {
					for(i in this.on) {
						if(i == type) {
							return this.on[i];
						}
					}
				} else {
					return false;
				}
				return false;

			},
			/**
			 * Triggers the event defined at 'type' with the event that
			 * is being passed.
			 * @param {String} type
			 * @param {Object} event
			 * @return {Object}
			 */
			fireEvent : function (event, type, ctx, obj) {
				if(typeof(type) == "undefined") {
					Canvas.util.debug("Layer::fireEvent; type is not defined");
					return false;
				}
				if(this.hasEvent(type)) {
					var evt = this.getEvent(type);
					return evt.call(this, event, type, ctx, obj);
					//return evt(type, event, this);
				} else {
					return false;
				}
				return false;
			} 
		};
		return defaultLayer.init(layer, lm);
	};
	
	/**
	 * @see Canvas.Item
	 * @param {Object} obj
	 * @param {Object} layer
	 */
	Canvas.Item = Canvas.prototype = function (item, layer) {
		var superParent = Canvas;
		var defaultItem = {
			/**
			 * @var id {String} The identifier string of the object
			 */
			id : "item_id",
			/**
			 * @var x {Int} The x coord of the object
			 */
			x : 0,
			/**
			 * @var y {Int} The y coord of the object
			 */
			y : 0,
			/**
			 * @var z {Int} The z-index of the object, for 3d context
			 */
			z : 0,
			/**
			 * @var height {Int} The height of the object
			 */
			height : 0,
			/**
			 * @var width {Int} The width of the object
			 */
			width : 0,
			/**
			 * @var canDrag {Bool} If you can drag the object
			 */
			canDrag : false,
			/**
			 * @var layer {Canvas.Layer} The parent layer
			 */
			layer: null,
			
			/**
			 * @var superParent {Canvas} The parent canvas obj
			 */
			superParent : null,
			
			/**
			 * Constructor for the Item object. It does some error checking
			 * then returns the combined item. Takes the item json object 
			 * as it's constructor, with the optional parent layer (Layer)
			 * object.
			 * @param {Object} item
			 * @param {Object} layer [optional]
			 */
			init : function (item, layer) {				
				if (typeof(layer) != "undefined") {
					// Small override, this should guarentee (if the user isn't stupid) that each item has it's own id
					item.id = item.id || (defaultItem.id + "_" + layer.getCount());
					
					// Avoiding id conflicts
					while (layer.findItem(item.id) !== false) {
						item.id += "_";
					}
				}
				// Save the layer
				this.layer = layer;
				
				// Save the superParent
				this.superParent = superParent;
				
				// Comine the item's default values with the passe values
				var combinedItem = Canvas.util.combine(this, item);
				
				// Save the object to the object manager
				this.superParent.ObjectManager.addObject(combinedItem.id, "Item", combinedItem);
				
				return combinedItem;
				
			},
			/**
			 * Returns the reference to the parent layer
			 */
			getLayer : function() {
				if(typeof(this.layer) != "null") {
					return this.layer;
				} else {
					return null;
				}
			},
			/**
			 * The draw handler, to be called at the layer level
			 * (or by the user) by the Layer::draw function
			 * @param {Object} ctx
			 */
			draw : function(ctx){
				if(typeof(ctx) == "undefined") {
					Canvas.util.debug("Item::draw; ctx is undefined");
					return false;
				}
			},
			/**
			 * Defines a set of mouse handlers to be called by a function
			 * later defined... =]
			 */
			on : {
				// mouseover
				// mouseout
				// mousedown
				// click
				// doubleclick
			},
			/**
			 * Returns the object ID
			 */
			getID : function () {
				return this.id;
			},
			/**
			 * Returns the x position of item
			 */
			getX : function () {
				if (typeof(this.x) == "number") {
					return parseInt(this.x);
				}
				else {
					return 0;
				}
			},
			/**
			 * Returns the y position of the item
			 */
			getY : function () {
				if (typeof(this.y) == "number") {
					return parseInt(this.y);
				}
				else {
					return 0;
				}
			},
			/**
			 * Returns the Z position of the item
			 */
			getZ : function () {
				if (typeof(this.z) == "number") {
					return parseInt(this.z);
				}
				else {
					return 0;
				}
			},
			/**
			 * Determines if the event 'type' has been defined, and if it
			 * is a function. If both are true it returns true, false
			 * otherwise
			 * @param {String} type
			 * @return {Bool}
			 */
			hasEvent : function (type) {
				if(typeof(type) == "undefined") {
					Canvas.util.debug("Item::hasEvent; type is not defined");
					return false;
				}
				if(typeof(this.on) != "undefined") {
					for(i in this.on) {
						if(i == type && typeof(this.on[i]) == "function") {
							return true;
						}
					}
				} else {
					return false;
				}
				return false;
			},
			/**
			 * Searches for and returns the event defined at 'type'.
			 * @param {String} type
			 * @return {Object}
			 */
			getEvent : function (type) {
				if(typeof(type) == "undefined") {
					Canvas.util.debug("Item::getEvent; type is not defined");
					return false;
				}
				if(this.hasEvent(type)) {
					for(i in this.on) {
						if(i == type) {
							return this.on[i];
						}
					}
				} else {
					return false;
				}
				return false;

			},
			/**
			 * Triggers the event defined at 'type' with the event that
			 * is being passed.
			 * @param {String} type
			 * @param {Object} event
			 * @return {Object}
			 */
			fireEvent : function (event, type, ctx, obj) {
				if(typeof(type) == "undefined") {
					Canvas.util.debug("Item::fireEvent; type is not defined");
					return false;
				}
				if(this.hasEvent(type)) {
					var evt = this.getEvent(type);
					return evt.call(this, event, type, ctx, obj);
				} else {
					return false;
				}
				return false;
			},
			toString : function () {
				return "[Canvas.Item]";
			},
			valueOf : function () {
				return "[Canvas.Item]";
			}
		};
		return defaultItem.init(item, layer);
	};
})();
