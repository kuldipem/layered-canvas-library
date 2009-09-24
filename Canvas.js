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
	var Canvas = this.Canvas = function (elID, dimension) {
		/**
		 * The 'sys' object contains version info, as well as the author name.
		 * It stores variables that should be kept 'private'.
		 */
		var sys = {
			/**
			 * @var version {String} The version of the library
			 */
			version : ".02",
			/**
			 * @var author {String} The name of the library creator
			 */
			author : "Michael Camden"
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
		
		var layerManager = {
			test : function () {
				var layer = new Layer({
					draw : function () {
						
					},
					items : [{
						id: "item1",
						draw : function () {}
					},{
						id: "item2",
						draw : function () {}
					},{
						id: "item3",
						draw : function () {}
					}
					]
				});
				
				
				layer.promoteItem("item3");
				
				util.debug(layer.getItemAt(0));
				util.debug(layer.getItemAt(1));
				util.debug(layer.getItemAt(2));
				
				return layer;
			},
			add : function (obj) {
				
			}
		};
		
		var Layer = function(layer) {
			var defaultLayer = {
				id : "layer_id",
				items: [],
				init : function (layer) {
					if(typeof(layer.items) == "undefined" || (typeof(layer.items) == "object" && !(layer.items instanceof Array))) {
						util.debug("Layer:init;layer.items not defined, or not array");
						return false;
					}
					// Having items in the definition prevents the new items from being created, and added properly
					var items = layer.items;
					delete(layer.items);
					
					for(i in items) {
						this.addItem(items[i], false);
					}
					
					return util.combine(this, layer);					
				},
				draw : function () {
					
				},
				getCount : function () {
					return this.items.length;
				},
				addItem : function (item, returnItem) {
					if(typeof(item) != "object") {
						util.debug("Layer::addItem; item is not an object");
						return false;
					}
					var newItem = new Item(item, this);
					
					this.items[this.getCount()] = newItem;
					
					
					if(returnItem) {
						//return this.getItemAt(this.getCount() - 1);
						return newItem;
					}
					return true;
				},
				getItem : function (itemID) {
					if(typeof(itemID) == "undefined") {
						util.debug("Layer::getItem; itemID is undefined");
						return false;
					}
					return this.items[this.findItem(itemID)];
				},
				getItems : function () {
					return this.items;
				},
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
				promoteItem : function (itemID) {
					if(typeof(itemID) == "undefined") {
						util.debug("Layer::promoteItem; itemID is undefined");
						return false;
					}
					
					
					var itemPosition = this.findItem(itemID);

					var newPosition = parseInt(itemPosition) - 1;
					
					return this.moveItemTo(itemID, newPosition);
				},
				demoteItem : function (itemID) {
					if(typeof(itemID) == "undefined") {
						util.debug("Layer::demoteItem; itemID is undefined");
						return false;
					}
					
					var itemPosition = this.findItem(itemID);
					
					var newPosition = parseInt(itemPosition) + 1;
					
					return this.moveItemTo(itemID, newPosition);					
				},
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
				}
			}
			
			return defaultLayer.init(layer);
			
		};
		
		/**
		 * The item to be passed in to a layer. Should contain at least the values of defaultItem
		 * @param {Object} obj The object definition
		 * @param {Object} layer The parent layer
		 */
		var Item = function (item, layer) {
			var defaultItem = {
				id : "item_id",
				x : 0,
				y : 0,
				z : 0,
				height : 0,
				width : 0,
				init : function (item, layer) {
			
					if (typeof(item.draw) == "undefined" || typeof(item.draw) != "function") {
						util.debug("Unable to create item, draw function missing");
						return false;
					}
					// Small override, this should guarentee (if the user isn't stupid) that each layer has it's own id
					item.id = item.id || (defaultItem.id + "_" + layer.getCount()); 
					
					// Avoiding id conflicts
					while(layer.findItem(item.id) !== false) {
						item.id += "_";
					}
										
					return util.combine(this, item);
					
				},
				draw : function(){
				
				},
				on : {
					// mouseover
					// mouseout
					// mousedown
					// click
					// doubleclick
				},
				getID : function () {
					return this.id;
				}
			};
			
			return defaultItem.init(item, layer);
		}

		// Start the obj we are going to return when someone creates a new Canvas
		var init = {
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
			__create : function (elID, dimension) {
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
					this.util.debug("elID not proper object, or string.");
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
					this.util.debug("Canvas Element not set properly");
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
			// System info, should contain private vars //
			sys : sys,
			// Utility stuff //
			util : util,
			// Layer Manager
			lm : layerManager
		};
		
		// Return the constructor function of init, which returns the whole obj
		return init.__create(elID, dimension);
	}
})();