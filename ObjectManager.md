# Canvas.ObjectManager #

ObjectManager manages every object created with the Canvas library. Basically this is a manager for the events. Shouldn't really be used by the user, but could be I guess.

# Properties #

_Private_ **Array objects** The array of objects it manages.

# Methods #

All the methods are private and are invoked by the library. While they can be used by the user, it's not recommended.

_Private_ **addObject(String objectID, String type, Object object)** Adds the object to the object array.

_Private_ **removeObject(String objectID, String type)** Removes the object from the object array.

_Private_ **findObject(String objectID, String type)** Find the object by the string identifier objectID, and type, then returns it.