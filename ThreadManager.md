# Canvas.ThreadManager #

ThreadManager is a singleton class that manages, well, Threads. You can invoke the ThreadManager by just typing it's name, and method. For example;

Canvas.ThreadManager.findThread("threadname");

## Properties ##

_Private_ **Array threads** The array of Threads that the ThreadManager, manages.

## Methods ##

_Private_ **getThreadAt(Integer position)** Returns the Thread at position.

_Private_ **findThread(String threadID)** Finds a Thread by the string identifier threadID, then returns it.

_Private_ **addThread(Object thread, Bool isThread `[optional]`)** Adds a new Thread to the list of managed Threads. If isThread is set to true, ThreadManager assumes that thread is a constructed Thread object.

_Private_ **removeThread(String threadID, Bool cleared)** Finds a Thread by the string identifier threadID, and removes it from the ThreadManager. This method will also clear the interval on the Thread, and will not fire the beforeexpire and expire events. If cleared is set to true, it will just remove the Thread from the managed array.

_Private_ **getCount()** Returns the number of Threads that are managed.

# Example #
```
new Canvas.Thread({
   // Infinite loooop
   expires : -1
   interval : 1000,
   exec : function () {
      // At tick, remove the thread. This means it will only execute 1 time
      Canvas.ThreadManager.removeThread(this.id);
   }
});

```