/**
 * @author mcamden
 * @todo Create the layer manager, should be setup to accept objects as new layers;
 * Canvas::addLayer(obj);
 * The object should be any json obj with a 'draw' function defined. The 'draw' function 
 * should take a single parameter, and that is the context returned from getCtx().
 * var obj = {
 *     stuff : "here",
 *     draw : function (ctx) {
 *        ctx.fillRect(0, 0, 100, 100);
 *        ...
 *     }
 * }
 */


// Executes a function within the Window namespace
(function () {

	/**
	 * Creates the Canvas object in the window space
	 * @param {String} elID
	 * @param {String} dimension
	 */
	var Canvas = this.Canvas = function (elID, dimension) {
		return Canvas.fn.init(elID, dimension);
	};
	
	/**
	 * The layer that is stored in the layer manager. This stores items
	 * and has options to promote the item, demote the item, etc... The 
	 * end result is to call the 'draw' function which calls each of the
	 * item's draw functions in turn (in their order). 
	 * @param {Object} layer
	 * @param {Object} lm [optional]
	 */
	Canvas.Layer = Canvas.prototype = function (layer, lm) {
		return Canvas.fn.Layer(layer, lm);
	};
	
	/**
	 * The item to be passed in to a layer. Should contain at least the values of defaultItem
	 * @param {Object} obj The object definition
	 * @param {Object} layer The parent layer
	 */	
	Canvas.Item = Canvas.prototype = function (obj, layer) {
		return Canvas.fn.Item(obj, layer);
	};

	/**
	 * A set of utility functions that help in all areas of the library 
	 */
	var util = {
		/**
		 * Combines two json objects, obj1 is the default values, obj2 is the passed values
		 * @param {Object} obj1
		 * @param {Object} obj2
		 */
		combine : function (obj1, obj2) {
			var obj = {};
			
			for(i in obj1) {
				if(typeof(obj2[i]) != "undefined") {
					obj[i] = obj2[i];
				} else {
					obj[i] = obj1[i];
				}
			}
			
			return obj;
		} ,
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
		}

	};
	
	/**
	 * @see Canvas
	 */
	Canvas.fn = Canvas.prototype = {
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
		 * Constructor of the object. elID can be the id of the canvas element
		 * or the DOM.
		 * @param {Object} elID
		 */
		init : function (elID, dimension) {
			this.setEl(elID, dimension);
			return this;
		},

		/**
		 * Returns the DOM element or false
		 */		
		getEl : function () {
			if(this.el != null && typeof(this.el) != "undefined")
				return this.el;
			else
				return false;
		},
		
		/**
		 * Sets this.el and this.elID params. 
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
					return true;
				}
				return false;
			} else if(typeof(elID) == "object") {
				if(elID.tagName && elID.tagName == "CANVAS") {
					this.el = elID;
					this.elID = elID.id || "__canvas";
					
					// Set the context of the element if dimension is set
					if(typeof(dimension) != "undefined") {
						this.setCtx(dimension);
					}

					return true;
				}
				return false;
			} else {
				// Throw debug message
				util.debug("elID not proper object, or string.");
			}
			return false;
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
				util.debug("Canvas Element not set properly");
			}
			return false;
		},
		
		/**
		 * Returns the context of the Canvas el, sets if it not set and dimension is set
		 * @param {String} dimension
		 */		
		getCtx : function (dimension) {
			if (typeof(this.elCtx) != "undefined" && this.elCtx != null) 
				return this.elCtx;
			else {
				return this.setCtx(dimension, true);
			}
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
		},

		/**
		 * LayerManager Alias
		 * @see Canvas.LayerManager
		 */
		lm : this.LayerManager,
		
		/**
		 * Control's and manage's Layers. 
		 */
		LayerManager : {
			
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
					util.debug("Canvas::LayerManager ctx is undefined");
					return false;
				}
				// Gotta have some layers to draw in
				if(typeof(this.layers) == "undefined") {
					util.debug("Canvas::LayerManager layers is undefined")
				}
				// Gotta be an array of layers
				if(typeof(this.layers) != "undefined" && !(this.layers instanceof Array) ) {
					util.debug("Canvas::LayerManager layers is not an array");
					return false;
				}
				// No really... gotta have some layers to draw in
				if(this.layers.length < 1) {
					util.debug("Canvas::LayerManager no layers to draw on");
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
					util.debug("LayerManager::findLayer; layerID is undefined");
					return false;
				}
				if(typeof(this.layers) == "undefined" || !(this.layers instanceof Array)) {
					util.debug("LayerManager::findLayer; no layers defined");
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
					util.debug("LayerManager::getLayerAt; position is undefined");
					return false;
				}
				if(typeof(this.layers[position]) == "undefined") {
					util.debug("LayerManager::getLayerAt; no layer at position");
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
					util.debug("LayerManager::addLayer; layer is undefined");
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
					util.debug("Layer::promoteLayer; layerID is undefined");
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
					util.debug("Layer::promoteLayer; layerID is undefined");
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
					util.debug("LayerManager::moveLayerTo; layerID is undefined");
					return false;
				}
				if(typeof(position) == "undefined") {
					util.debug("LayerManager::moveLayerTo; position is undefined");
					return false;
				}
				if(position < 0)
					position = 0;
				if(position > (this.getCount() - 1))
					position = (this.getCount() - 1);
				
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
					if(i != position) {
						newlayers.push(oldlayers[i]);
					} else
						newlayers.push(layer);
				}
				this.layers = newlayers;
				return true;	
			}
		},

		/**
		 * @see Canvas.Layer
		 * @param {Object} layer
		 * @param {Object} lm
		 */
		Layer : function (layer, lm) {
			var parent = this;
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
						util.debug("Layer::init; layer is undefined");
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
					
					// Returns the combined object
					return util.combine(this, layer);					
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
						util.debug("Layer::draw; ctx is undefined");
						return false;
					}
					
					// If the layer items is undefined
					if(typeof(this.items) == "undefined") {
						util.debug("Layer::draw; Layer::items is undefined");
						return false;
					}
					// If the items are defined, but not an array
					if(typeof(this.items) != undefined && !(this.items instanceof Array)) {
						util.debug("Layer::draw; Layer::items is not an array");
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
						util.debug("Layer::getCount; Layer::items is undefined");
						return 0;
					}
					if(typeof(this.items) != "undefined" && !(this.items instanceof Array)) {
						util.debug("Layer::getCount; Layer::items is not array");
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
						util.debug("Layer::addItem; item is not an object");
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
						util.debug("Layer::getItem; itemID is undefined");
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
						util.debug("Layer::getItemAt; position is undefined");
						return false;
					}
					if(typeof(this.items[position]) != "undefined")
						return this.items[position];
					else
						return false;
				},
				/**
				 * Find's the item with the ID, itemID
				 * @param {String} itemID
				 */
				findItem : function (itemID) {
					if(typeof(itemID) == "undefined") {
						util.debug("Layer::findItem; itemID is undefined");
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
						util.debug("Layer::promoteItem; itemID is undefined");
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
						util.debug("Layer::demoteItem; itemID is undefined");
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
						util.debug("Layer::moveItem; itemID is undefined");
						return false;
					}
					if(typeof(position) == "undefined") {
						util.debug("Layer::moveItem; position is undefined");
						return false;
					}
					if(position < 0)
						position = 0;
					if(position > (this.getCount() - 1))
						position = (this.getCount() - 1);
					
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
						if(i != position) {
							newItems.push(oldItems[i]);
						} else
							newItems.push(item);
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
						util.debug("Layer::remoteItem; itemID is undefined");
						return false;
					}
					var itemPosition = false;
					if((itemPosition = this.findItem(itemID)) !== false) {
						this.items.splice(itemPosition, 1);
						return true;
					} else {
						util.debug("Layer:removeItem; unable to find itemID in items");
						return false;
					}
				},
				/**
				 * Returns the object type
				 */
				type : function () {
					return "Layer"
				}
			};
			return defaultLayer.init(layer, lm);
		},
		/**
		 * @see Canvas.Item
		 * @param {Object} obj
		 * @param {Object} layer
		 */
		Item : function (obj, layer) {
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
				 * @var layer {Canvas.Layer} The parent layer
				 */
				layer: null,
				/**
				 * Constructor for the Item object. It does some error checking
				 * then returns the combined item. Takes the item json object 
				 * as it's constructor, with the optional parent layer (Layer)
				 * object.
				 * @param {Object} item
				 * @param {Object} layer [optional]
				 */
				init : function (item, layer) {
			
					if (typeof(item.draw) == "undefined" || typeof(item.draw) != "function") {
						util.debug("Unable to create item, draw function missing");
						return false;
					}
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
					
					// var a = new Canvas('test');var b = new Canvas.Layer({id: "Stff", items:[{draw: function(ctx) {ctx.fillRect(20, 20, 40, 40);};}, { draw: function (ctx) {ctx.fillRect(0, 0, 20, 20);} } ]});
					return util.combine(this, item);
					
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
						util.debug("Item::draw; ctx is undefined");
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
					if(typeof(this.x) == "number") {
						return parseInt(this.x);
					} else
						return 0;
				},
				/**
				 * Returns the y position of the item
				 */
				getY : function () {
					if(typeof(this.y) == "number") {
						return parseInt(this.y);
					} else 
						return 0;
				},
				/**
				 * Returns the Z position of the item
				 */
				getZ : function () {
					if(typeof(this.z) == "number") {
						return parseInt(this.z);
					} else
						return 0;
				},
				/**
				 * Returns the object type
				 */
				type : function () {
					return "Item";
				}
			};
			return defaultItem.init(obj, layer);
		}
	};
})();		