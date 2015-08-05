# Canvas.Thread #

Canvas.Thread is essentially a complex object that utilizes setInterval.

# Canvas.Thread.constructor #

The constructor method takes a complex object and returns a constructed Thread.

The constructed Thread is automatically added to the ThreadManager.

## Object Parameters ##

_Public_ **String id** The string identifier for Thread.

_Public_ **Integer expires** The number of ticks before the Thread expires. Set this to -1 for a thread that will never expire.

_Public_ **Integer interval** The Thread interval specified in milliseconds.

_Public_ **Object on** Defines a set of events to listen for. An Item can listen to the following events;

  * beforeexpire
  * expire

Events should be defined as,
```
   on : {
      "eventName" : function (Integer expires) {}
   }
```

Please note, you can return false on the beforeexpire event to prolong the life of the Thread.

_Private_ **DOMInterval timer** The reference to the interval returned from the setInterval method.

## Methods ##

_Public_ **exec(Integer expires)** The function that is called at every interval.

_Private_ **getID()** Returns the string identifier for the Thread.

_Private_ **fireEvent(String type)** This method is invoked by the ThreadManager singleton class.

_Private_ **tick()** This method is called at every interval. It counts down the expires Integer, as well as fires the beforeexpires and expires method. It is imperative that the user not override this method.

_Private_ **clearThread()** This will clear the interval for the Thread, as well as remove it.

# Example #
```

new Canvas.Thread({
   id : "thread",
   expires : 5,
   interval : 1000,
   // Way annoying...
   exec : function (expires) {
      alert("Thread expires in... " + expires);
   },
   on : {
      "expire" : function () {
         alert("Whew, glad that's over");
      }
   }
});

```