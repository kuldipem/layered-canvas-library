(function(){var Canvas=this.Canvas={version:'1.3.1',author:"Michael Camden",elID:"",el:null,elCtx:null,x:0,y:0,getEl:function(){if(this.el!=null&&typeof(this.el)!="undefined"){return this.el;}
else{return false;}},setEl:function(elID,dimension){if(typeof(elID)=="string"){var _el=document.getElementById(elID);if(_el!=null&&_el.tagName=="CANVAS"){this.el=_el;this.elID=elID;if(typeof(dimension)!="undefined"){this.setCtx(dimension);}}}else if(typeof(elID)=="object"){if(elID.tagName&&elID.tagName=="CANVAS"){this.el=elID;this.elID=elID.id||"__canvas";if(typeof(dimension)!="undefined"){this.setCtx(dimension);}}}else{Canvas.util.debug("elID not proper object, or string.");}
if(this.el==null||typeof(this.el)=="undefined"){return false;}
this.el.onmousemove=this.fireEvent;this.el.onclick=this.fireEvent;this.el.ondblclick=this.fireEvent
this.el.onmousedown=this.fireEvent;this.el.onmouseup=this.fireEvent;window.onkeydown=this.fireEvent;window.onkeyup=this.fireEvent;window.onkeypress=this.fireEvent;var position=Canvas.util.findPos(this.el);this.x=position[0];this.y=position[1];return true;},setCtx:function(dimension,returnContext){if(typeof(this.el)!="undefined"&&this.el!=null){var _d=dimension||"2d";if(returnContext){this.elCtx=this.el.getContext(_d);return this.elCtx;}
else{this.elCtx=this.el.getContext(_d);return true;}}else{Canvas.util.debug("Canvas Element not set properly");}
return false;},getCtx:function(dimension){if(typeof(this.elCtx)!="undefined"&&this.elCtx!=null){return this.elCtx;}
else{return this.setCtx(dimension,true);}
return false;},fireEvent:function(event){var canvas=Canvas;var type="N/A";if(typeof(event.type)!="undefined"){type=event.type;}
if(typeof(canvas)=="undefined"){Canvas.util.debug("Canvas::fireEvent; Can't find canvas");return false;}
var mouseX=parseInt(event.clientX)-parseInt(canvas.x);var mouseY=parseInt(event.clientY)-parseInt(canvas.y);event.mouseX=mouseX;event.mouseY=mouseY;var mouseEventsToFire=new Array();var mouseEvents=new Array("click","dblclick","mousemove","mouseover","mousedown","mouseup");var length=canvas.ObjectManager.objects.length;for(i=0;i<=length;i++){var obj=canvas.ObjectManager.objects[i].object;if(Canvas.util.isOverObj(mouseX,mouseY,obj)&&type=="mousemove"&&typeof(obj._mouseover)=="undefined"){obj._mouseover=true;if(obj.hasEvent("mouseover")){obj.fireEvent(event,"mouseover",canvas.getCtx(),obj);}}
else if(!Canvas.util.isOverObj(mouseX,mouseY,obj)&&type=="mousemove"&&typeof(obj._mouseover)=="boolean"){delete(obj._mouseover);if(obj.hasEvent("mouseout")){obj.fireEvent(event,"mouseout",canvas.getCtx(),obj);}}
if(Canvas.util.isOverObj(mouseX,mouseY,obj)&&type=="mousedown"&&typeof(obj._isDraggable)=="undefined"){obj._isDraggable=true;obj.canDrag=true;}else if(!Canvas.util.isOverObj(mouseX,mouseY,obj)&&type=="mouseup"&&typeof(obj._isDraggable)=="boolean"){delete(obj._isDraggable);obj.canDrag=false;}
if(obj.hasEvent(type)){if(mouseEvents.toString().search(type)!==-1){if(Canvas.util.isOverObj(mouseX,mouseY,obj)){obj.fireEvent(event,type,canvas.getCtx(),obj);}}else{obj.fireEvent(event,type,canvas.getCtx(),obj);}}}
return true;},clear:function(){if(this.getCtx()!==false){var cvs=this.getEl();this.getCtx().clearRect(0,0,parseInt(cvs.width),parseInt(cvs.height));return true;}else{return false;}},toString:function(){return"[Canvas]";},valueOf:function(){return"[Canvas]";}};Canvas.util=Canvas.prototype={combine:function(obj1,obj2){var obj={};for(i in obj1){if(typeof(obj2[i])!="undefined"){obj[i]=obj2[i];}else{obj[i]=obj1[i];}}
for(i in obj2){if(typeof(obj[i])=="undefined"){obj[i]=obj2[i];}}
return obj;},debug:function(message){if(window.console){window.console.log(message);return true;}
else{return false;}},findPos:function(obj){var curLeft=curTop=0;if(obj.offsetParent){do{curLeft+=obj.offsetLeft;curTop+=obj.offsetTop;}while(obj=obj.offsetParent);}
return[curLeft,curTop];},isOverObj:function(mouseX,mouseY,obj){if(typeof(obj.width)=="undefined"||typeof(obj.height)=="undefined"||typeof(obj.x)=="undefined"||typeof(obj.y)=="undefined"){return false;}
if(mouseX>=obj.x&&mouseX<=(obj.x+obj.width)){if(mouseY>=obj.y&&mouseY<=(obj.y+obj.height)){return true;}}
return false;}};Canvas.ObjectManager=Canvas.prototype={objects:[],addObject:function(objectID,type,object){if(typeof(objectID)=="undefined"){Canvas.util.debug("ObjectManager::addObject; objectID is not defined");return false;}
if(typeof(type)=="undefined"){Canvas.util.debug("ObjectManager::addObject; type is not defined");return false;}
if(typeof(object)=="undefined"){Canvas.util.debug("ObjectManager::addObject; object is not defined");return false;}
if(this.findObject(objectID,type)===false){this.objects.push({objectType:type,objectID:objectID,object:object});return true;}else{return false;}},removeObject:function(objectID,type){if(typeof(objectID)=="undefined"){Canvas.util.debug("ObjectManager::removeObject; objectID is not defined");return false;}
if(typeof(type)=="undefined"){Canvas.util.debug("ObjectManager::removeObject; type is not defined");return false;}
var obj=this.findObject(objectID,type);if(obj!==false){this.objects.splice(obj.objectAt,1);return true;}else{return false;}},findObject:function(objectID,type){if(typeof(this.objects)=="undefined"){Canvas.util.debug("ObjectManager::findObject; objects is undefined");return false;}
if(typeof(this.objects)!="undefined"&&!(this.objects instanceof Array)){Canvas.util.debug("ObjectManager::findObject; objects is not an array");return false;}
if(typeof(objectID)=="undefined"){Canvas.util.debug("ObjectManager::findObject; objectID is not defined");return false;}
if(typeof(type)=="undefined"){Canvas.util.debug("ObjectManager::findObject; type is not defined");return false;}
var length=this.objects.length;for(i=0;i<=length;i++){if(this.objects[i].objectType==type&&this.objects[i].objectID==objectID){var returnObject={objectAt:i,objectID:i.objectID,objectType:i.objectType,object:i.object};return returnObject;}}
return false;}};Canvas.LayerManager=Canvas.prototype={layers:[],getCount:function(){return this.layers.length;},draw:function(ctx){if(typeof(ctx)=="undefined"){ctx=Canvas.getCtx();}
if(typeof(ctx)=="undefined"){Canvas.util.debug("Canvas::LayerManager ctx is undefined");return false;}
if(typeof(this.layers)=="undefined"){Canvas.util.debug("Canvas::LayerManager layers is undefined")}
if(typeof(this.layers)!="undefined"&&!(this.layers instanceof Array)){Canvas.util.debug("Canvas::LayerManager layers is not an array");return false;}
if(this.layers.length<1){Canvas.util.debug("Canvas::LayerManager no layers to draw on");return false;}
var length=this.layers.length;for(i=0;i<=length;i++){if(typeof(this.layers[i].draw)=="function"){this.layers[i].draw(ctx);}}
return true;},findLayer:function(layerID){if(typeof(layerID)=="undefined"){Canvas.util.debug("LayerManager::findLayer; layerID is undefined");return false;}
if(typeof(this.layers)=="undefined"||!(this.layers instanceof Array)){Canvas.util.debug("LayerManager::findLayer; no layers defined");return false;}
var length=this.layers.length;for(i=0;i<=length;i++){var layer=this.getLayerAt(i);if(layer.getID()==layerID){return layer;}}
return false;},findItem:function(itemID,layerID){var length=this.layers.length;var layer=item=null;if(typeof(itemID)=="undefined"){Canvas.util.debug("LayerManager::findItem; itemID is not defined");return false;}
if(typeof(this.layers)=="undefined"||!(this.layers instanceof Array)){Canvas.util.debug("LayerManager::findItem; no layers defined");return false;}
if(typeof(layerID)!="undefined"){layer=this.findLayer(layerID);if(layer===false){Canvas.util.debug("LayerManager::findItem; layer not found");return false;}else{item=layer.getItem(itemID);if(item===false){Canvas.util.debug("LayerManager::findItem; item not found");return false;}else{return item;}}}else{for(i=0;i<=length;i++){layer=this.getLayerAt(i);item=layer.getItem(itemID);if(item!==false){return item;}}
Canvas.util.debug("LayerManager::findItem; item not found");return false;}},findLayerPosition:function(layerID){if(typeof(layerID)=="undefined"){Canvas.util.debug("LayerManager::findLayerPosition; layerID is undefined");return false;}
if(typeof(this.layers)=="undefined"||!(this.layers instanceof Array)){Canvas.util.debug("LayerManager::findLayerPosition; no layers defined");return false;}
var length=this.layers.length;for(i=0;i<=length;i++){var layer=this.getLayerAt(i);if(layer.getID()==layerID){return i;}}
return false;},getLayerAt:function(position){if(typeof(position)=="undefined"){Canvas.util.debug("LayerManager::getLayerAt; position is undefined");return false;}
if(typeof(this.layers[position])=="undefined"){Canvas.util.debug("LayerManager::getLayerAt; no layer at position");return false;}
return this.layers[position];},addLayer:function(layer,isLayer){if(typeof(isLayer)=="undefined"){isLayer=false;}
if(typeof(layer)=="undefined"){Canvas.util.debug("LayerManager::addLayer; layer is undefined");return false;}
if(typeof(layer)=="array"){for(i in layer){this.layers.push(new Canvas.Layer(layer[i],this));}}
else{if(!isLayer){this.layers.push(new Canvas.Layer(layer,this));}else{this.layers.push(layer);}}
return true;},promoteLayer:function(layerID){if(typeof(layerID)=="undefined"){Canvas.util.debug("Layer::promoteLayer; layerID is undefined");return false;}
var layerPosition=this.findLayer(layerID);var newPosition=parseInt(layerPosition)-1;return this.moveLayerTo(layerID,newPosition);},demoteLayer:function(layerID){if(typeof(layerID)=="undefined"){Canvas.util.debug("Layer::promoteLayer; layerID is undefined");return false;}
var layerPosition=this.findLayer(layerID);var newPosition=parseInt(layerPosition)-1;return this.moveLayerTo(layerID,newPosition);},moveLayerTo:function(layerID,position){if(typeof(layerID)=="undefined"){Canvas.util.debug("LayerManager::moveLayerTo; layerID is undefined");return false;}
if(typeof(position)=="undefined"){Canvas.util.debug("LayerManager::moveLayerTo; position is undefined");return false;}
if(position<0){position=0;}
if(position>(this.getCount()-1)){position=(this.getCount()-1);}
var layerPosition=this.findLayer(layerID);if(layerPosition===false){return false;}
var layer=new Object;var oldLayers=this.items;var newLayers=new Array();layer=oldLayers.splice(layerPosition,1);layer=layer[0];var length=this.getCount();for(var i=0;i<=length;i++){if(i!=position){newLayers.push(oldLayers[i]);}
else{newLayers.push(layer);}}
this.layers=newLayers;return true;},removeLayer:function(layerID){if(typeof(layerID)=="undefined"){Canvas.util.debug("LayerManager::removeLayer; layerID is not defined");return false;}
if(typeof(this.layers)=="undefined"||!(this.layers instanceof Array)){Canvas.util.debug("LayerManager::removeLayer; no layers defined");return false;}
var position=this.findLayerPosition(layerID);if(position!==false){if(this.getLayerAt(position)!==false){var lyr=this.getLayerAt(position);lyr.removeAllItems();}
this.layers.splice(position,1);Canvas.ObjectManager.removeObject(layerID,"Layer");return true;}
return false;},toString:function(){var out="[";for(i in this.layers){out+=this.layers[i].getID()+",";}
out+="]";Canvas.util.debug(out);}};Canvas.Layer=Canvas.prototype=function(layer,lm){var parent=Canvas;var defaultLayer={id:"layer_id",parent:parent,items:[],init:function(layer,lm){if(typeof(layer)=="undefined"){Canvas.util.debug("Layer::init; layer is undefined");return false;}
if(typeof(layer.items)!="undefined"&&(layer.items instanceof Array)){var items=layer.items;delete(layer.items);var length=items.length;for(var i=0;i<=length;i++){this.addItem(items[i],false);}}
this.id=typeof(layer.id)!="undefined"?layer.id:this.id;if(typeof(lm)!="undefined"){while(lm.findLayer(this.id)!==false){this.id+="_";}}
var combinedLayer=Canvas.util.combine(this,layer);this.parent.ObjectManager.addObject(combinedLayer.id,"Layer",combinedLayer);this.parent.LayerManager.addLayer(combinedLayer,true);return combinedLayer;},on:{},draw:function(ctx){if(typeof(ctx)=="undefined")
ctx=this.parent.getCtx();if(typeof(ctx)=="undefined"){Canvas.util.debug("Layer::draw; ctx is undefined");return false;}
if(typeof(this.items)=="undefined"){Canvas.util.debug("Layer::draw; Layer::items is undefined");return false;}
if(typeof(this.items)!=undefined&&!(this.items instanceof Array)){Canvas.util.debug("Layer::draw; Layer::items is not an array");return false;}
var length=this.items.length;for(var i=0;i<=length;i++){if(typeof(this.items[i].draw)=="function"){this.items[i].draw(ctx);}}
return true;},getCount:function(){if(typeof(this.items)=="undefined"){Canvas.util.debug("Layer::getCount; Layer::items is undefined");return 0;}
if(typeof(this.items)!="undefined"&&!(this.items instanceof Array)){Canvas.util.debug("Layer::getCount; Layer::items is not array");return 0;}
return this.items.length;},getID:function(){return this.id;},addItem:function(item,returnItem){if(typeof(item)!="object"){Canvas.util.debug("Layer::addItem; item is not an object");return false;}
var newItem=new Canvas.Item(item,this);this.items[this.getCount()]=newItem;if(returnItem){return newItem;}
return true;},getItem:function(itemID){if(typeof(itemID)=="undefined"){Canvas.util.debug("Layer::getItem; itemID is undefined");return false;}
var item=this.findItem(itemID);if(typeof(item)=="undefined"){Canvas.util.debug("Layer::getItem; item not found");return false;}
return this.getItemAt(item);},getItemAt:function(position){if(typeof(position)=="undefined"){Canvas.util.debug("Layer::getItemAt; position is undefined");return false;}
if(typeof(this.items[position])!="undefined"){return this.items[position];}
else{return false;}},findItem:function(itemID){if(typeof(itemID)=="undefined"){Canvas.util.debug("Layer::findItem; itemID is undefined");return false;}
if(typeof(this.items)=="object"&&(this.items instanceof Array)){var length=this.items.length;for(var i=0;i<=length;i++){if(this.items[i].getID()==itemID){return i;}}
return false;}
return false;},promoteItem:function(itemID){if(typeof(itemID)=="undefined"){Canvas.util.debug("Layer::promoteItem; itemID is undefined");return false;}
var itemPosition=this.findItem(itemID);var newPosition=parseInt(itemPosition)+1;return this.moveItemTo(itemID,newPosition);},demoteItem:function(itemID){if(typeof(itemID)=="undefined"){Canvas.util.debug("Layer::demoteItem; itemID is undefined");return false;}
var itemPosition=this.findItem(itemID);var newPosition=parseInt(itemPosition)-1;return this.moveItemTo(itemID,newPosition);},moveItemTo:function(itemID,position){if(typeof(itemID)=="undefined"){Canvas.util.debug("Layer::moveItem; itemID is undefined");return false;}
if(typeof(position)=="undefined"){Canvas.util.debug("Layer::moveItem; position is undefined");return false;}
if(position<0){position=0;}
if(position>(this.getCount()-1)){position=(this.getCount()-1);}
var itemPosition=this.findItem(itemID);if(itemPosition===false){return false;}
var item=new Object;var oldItems=this.items;var newItems=new Array();item=oldItems.splice(itemPosition,1);item=item[0];var length=this.getCount();for(var i=0;i<=length;i++){if(i!=position){newItems.push(oldItems[i]);}
else{newItems.push(item);}}
this.items=newItems;return true;},removeItem:function(itemID){if(typeof(itemID)=="undefined"){Canvas.util.debug("Layer::remoteItem; itemID is undefined");return false;}
var itemPosition=false;if((itemPosition=this.findItem(itemID))!==false){this.items.splice(itemPosition,1);Canvas.ObjectManager.removeObject(itemID,"Item");return true;}else{Canvas.util.debug("Layer:removeItem; unable to find itemID in items");return false;}},removeAllItems:function(){if(!(this.items instanceof Array)||this.items.length==0){Canvas.util.debug("Layer::removeAllItems; No items to remove");return false;}
for(i in this.items){var item=this.getItemAt(i);Canvas.ObjectManager.removeObject(item.getID(),"Item");}
this.items=[];return true;},hasEvent:function(type){if(typeof(type)=="undefined"){Canvas.util.debug("Layer::hasEvent; type is not defined");return false;}
if(typeof(this.on)!="undefined"){for(i in this.on){if(i==type&&typeof(this.on[i])=="function"){return true;}}}else{return false;}
return false;},getEvent:function(type){if(typeof(type)=="undefined"){Canvas.util.debug("Layer::getEvent; type is not defined");return false;}
if(this.hasEvent(type)){for(i in this.on){if(i==type){return this.on[i];}}}else{return false;}
return false;},fireEvent:function(event,type,ctx,obj){if(typeof(type)=="undefined"){Canvas.util.debug("Layer::fireEvent; type is not defined");return false;}
if(this.hasEvent(type)){var evt=this.getEvent(type);return evt.call(this,event,type,ctx,obj);}else{return false;}
return false;}};return defaultLayer.init(layer,lm);};Canvas.Item=Canvas.prototype=function(item,layer){var superParent=Canvas;var defaultItem={id:"item_id",x:0,y:0,z:0,height:0,width:0,canDrag:false,layer:null,superParent:null,init:function(item,layer){if(typeof(layer)!="undefined"){item.id=item.id||(defaultItem.id+"_"+layer.getCount());while(layer.findItem(item.id)!==false){item.id+="_";}}
this.layer=layer;this.superParent=superParent;var combinedItem=Canvas.util.combine(this,item);this.superParent.ObjectManager.addObject(combinedItem.id,"Item",combinedItem);return combinedItem;},getLayer:function(){if(typeof(this.layer)!="null"){return this.layer;}else{return null;}},draw:function(ctx){if(typeof(ctx)=="undefined"){Canvas.util.debug("Item::draw; ctx is undefined");return false;}
return true;},on:{},getID:function(){return this.id;},getX:function(){if(typeof(this.x)=="number"){return parseInt(this.x);}
else{return 0;}},getY:function(){if(typeof(this.y)=="number"){return parseInt(this.y);}
else{return 0;}},getZ:function(){if(typeof(this.z)=="number"){return parseInt(this.z);}
else{return 0;}},hasEvent:function(type){if(typeof(type)=="undefined"){Canvas.util.debug("Item::hasEvent; type is not defined");return false;}
if(typeof(this.on)!="undefined"){for(i in this.on){if(i==type&&typeof(this.on[i])=="function"){return true;}}}else{return false;}
return false;},getEvent:function(type){if(typeof(type)=="undefined"){Canvas.util.debug("Item::getEvent; type is not defined");return false;}
if(this.hasEvent(type)){for(i in this.on){if(i==type){return this.on[i];}}}else{return false;}
return false;},fireEvent:function(event,type,ctx,obj){if(typeof(type)=="undefined"){Canvas.util.debug("Item::fireEvent; type is not defined");return false;}
if(this.hasEvent(type)){var evt=this.getEvent(type);return evt.call(this,event,type,ctx,obj);}else{return false;}
return false;},toString:function(){return"[Canvas.Item]";},valueOf:function(){return"[Canvas.Item]";}};return defaultItem.init(item,layer);};Canvas.ThreadManager=Canvas.prototype={threads:[],getThreadAt:function(position){if(typeof(position)=="undefined"){Canvas.util.debug("ThreadManager::getThreadAt; position is not defined");return false;}
if(typeof(this.threads[position])=="undefined"){Canvas.util.debug("ThreadManager::getThreadAt; no thread found at that position");return false;}
if(typeof(this.threads)=="object"&&(this.threads instanceof Array)){return this.threads[position];}
return false;},findThread:function(threadID){if(typeof(threadID)=="undefined"){Canvas.util.debug("ThreadManager::findThread; threadID is not defined");return false;}
if(this.threads.length<1)
return false;if(typeof(this.threads)=="object"&&(this.threads instanceof Array)){var length=this.threads.length;for(var i=0;i<=length;i++){if(this.getThreadAt(i)!==false&&this.getThreadAt(i).getID()==threadID){return{position:i,obj:this.threads[i]};}}}
return false;},addThread:function(thread,isThread){if(typeof(isThread)=="undefined"){isThread=false;}
if(typeof(thread)=="undefined"){Canvas.util.debug("ThreadManager::addThread; thread is not defined");return false;}
if(typeof(this.threads)=="undefined"||!(this.threads instanceof Array)){this.threads=new Array();}
if(typeof(thread.id)!="undefined"){if(this.findThread(thread.id)!==false){return false;}}
if(isThread){this.threads.push(thread);}
else{this.threads.push(new Canvas.Thread(thread));}
return true;},removeThread:function(threadID,cleared){if(typeof(cleared)=="undefined"){cleared=false;}
if(typeof(threadID)=="undefined"){Canvas.util.debug("ThreadManager::removeThread; threadID is not defined");return false;}
var thread=this.findThread(threadID);if(!cleared){thread.objs.clearThread();}
this.threads.splice(thread.position,1);return true;},getCount:function(){if(typeof(this.threads)=="undefined"){return 0;}
if(typeof(this.threads)!="undefined"&&!(this.threads instanceof Array)){return 0;}
return this.threads.length;}};Canvas.Thread=Canvas.prototype=function(thread){defaultThread={id:"thread_",expires:-1,interval:500,timer:null,init:function(thread){if(typeof(thread)=="undefined"||typeof(thread)!="object"){Canvas.util.debug("Thread::init; thread is not defined, or not an object");return false;}
var combinedThread=Canvas.util.combine(defaultThread,thread);combinedThread.id=thread.id||defaultThread.id+"_"+Canvas.ThreadManager.getCount();while(Canvas.ThreadManager.findThread(combinedThread.getID())!==false){combinedThread.id+="_";}
Canvas.ThreadManager.addThread(combinedThread,true);if(typeof(combinedThread.expires)=="undefined"){combinedThread.exec();return true;}else{if(combinedThread.expires==0){Canvas.util.debug("Thread::init; thread must have at least one interval");return false;}else{combinedThread.timer=setInterval('Canvas.ThreadManager.findThread("'+combinedThread.id+'").obj.tick()',combinedThread.interval);}}
return combinedThread;},getID:function(){return this.id;},exec:function(){},fireEvent:function(type){if(typeof(type)=="undefined"){Canvas.util.debug("Thread::type; is not defined");return false;}else{if(typeof(this.on[type])!="undefined"){return this.on[type].call(this);}}
return true;},on:{},tick:function(){if(this.expires!=-1){this.expires-=1;}
if(this.expires==0){if(this.fireEvent("beforeexpire")!==false){this.clearThread();}else{this.expires++;}}
this.exec.call(this,this.expires);if(this.expires==0){this.fireEvent("expire");}
return true;},clearThread:function(){clearInterval(this.timer);Canvas.ThreadManager.removeThread(this.getID(),true);}};return defaultThread.init(thread);}})();