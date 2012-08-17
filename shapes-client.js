/**
 * Created by Igor Zalutsky on 17.08.12 at 12:48
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.sclient) {
        window.sclient = {};
    }
    var sclient = window.sclient;

    /**
     * Extends a constructor with BaseConstructor's prototype
     * @param BaseConstructor
     */
    Function.prototype.inheritFrom = function(BaseConstructor){
        var sampleInstance = new BaseConstructor();
        this.prototype = sampleInstance;
    };
    /**
     * Throw an error with custom message
     * @param errorMessage Optional, "Something went wrong" by default
     */
    sclient.report = function(errorMessage) {
        throw new Error(errorMessage ? errorMessage : "Something went wrong");
    };


}());

/**
 * Created by Igor Zalutsky on 17.08.12 at 12:01
 */

(function() {
    "use strict";
    // publishing namespace
    if (!window.sclient) {
        window.sclient = {};
    }
    var sclient = window.sclient;
    /**
     * Provides interface for subscribing, unsubscribing to events and causing them
     * @constructor
     */
    sclient.EventEmitter = function(){
        this.listeners = {};
    };
    /**
     * Subscribes listenerFunc to the the specified event
     * @param eventName {string} Name of event to be listened
     * @param listenerFunc {function} event listener; will be called with two params:
     *   origin - object in which the event occured
     *   args - optional data from origin
     */
    sclient.EventEmitter.prototype.on = function(eventName, listenerFunc) {
        //TODO params validation in EventEmitter.on

        if (!(this.listeners[eventName] instanceof Array)) {                                  // no such event
            this.listeners[eventName] = [];
        }
        if (this.listeners[eventName].indexOf(listenerFunc) === -1) {      //listenerFunc is not yet subscribed
            this.listeners[eventName].push(listenerFunc);
        }
    };
    /**
     * Unsubscribes listenerFunc from specified event
     * @param eventName {string} Name of event to be listened
     * @param listenerFunc event listener
     */
    sclient.EventEmitter.prototype.off = function(eventName, listenerFunc) {
        //TODO params validation in EventEmitter.off
        if(this.listeners[eventName] instanceof Array) {    // such event exists
            var index = this.listeners[eventName].indexOf(listenerFunc);
            if (index !== -1) {         // and this func listens to it
                this.listeners[eventName].splice(index,1);     // removing listener
            }
        }
    };
    /**
     *
     * @param eventName {string} Name of event to be caused
     * @param eventArgs Object with info for listener
     */
    sclient.EventEmitter.prototype.emit = function(eventName, eventArgs) {
        //TODO params validation in EventEmitter.cause
        eventArgs = eventArgs || {};
        if(this.listeners[eventName] instanceof Array) {    // such event exists
            var count = this.listeners[eventName].length;
            for (var i = 0; i < count; i+=1) {
                this.listeners[eventName][i](this, eventArgs);    // calling listener function
            }
        }
    };
}());
/**
 * Created by Igor Zalutsky on 17.08.12 at 12:07
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.sclient) {
        window.sclient = {};
    }
    var sclient = window.sclient;

    /**
     * Collection that emits "change" event whenever it's changed
     * @constructor
     */
    sclient.ObservableCollection = function(){
        this.listeners = {};
        this.items = [];
    };

    // Extending EventEmitter
    sclient.ObservableCollection.inheritFrom(sclient.EventEmitter);

    /**
     * Searches for item by index
     * @param index
     * @return {*}
     */
    sclient.ObservableCollection.prototype.at = function(index) {
        if (index < 0 || index >= this.items.length) {
            sclient.report("Index out of bounds");
        }
        return this.items[index];
    };

    /**
     * Checks if it contains specified item
     * @param item
     * @return {Boolean}
     */
    sclient.ObservableCollection.prototype.has = function(item){
        return (this.items.indexOf(item) >= 0);
    };

    /**
     * Returns amount of items
     * @return {Number}
     */
    sclient.ObservableCollection.prototype.count = function(){
        return this.items.length;
    };

    /**
     * Adds an item. Causes "change" event.
     * @param item
     * @return {*}
     */
    sclient.ObservableCollection.prototype.add = function(item){
        if (!this.has(item)) {
            this.items.push(item);
            this.emit("change");
        }
        return this;
    };

    /**
     * Removes an item. Causes "change" event
     * @param item
     * @return {*}
     */
    sclient.ObservableCollection.prototype.remove = function(item){
        var index = this.items.indexOf(item);
        if (index >= 0) {
            this.items.splice(index, 1);
            this.emit("change");
        }
        return this;
    };

    /**
     * Sorts collection according to comparer func. Causes "change" event.
     * @param comparer Function(item1, item2), must return number, better -1 0 1
     */
    sclient.ObservableCollection.prototype.sortBy = function(comparer){
        this.items.sort(comparer);
        this.emit("change");
        return this;
    };
    /**
     * Sorts collection according to keyExtractor result. Causes "change" event.
     * @param keyExtractor
     */
    sclient.ObservableCollection.prototype.orderBy = function(keyExtractor, reverse){
        return this.sortBy(function(item1, item2){
            var result = 0;
            var key1 = keyExtractor(item1);
            var key2 = keyExtractor(item2);
            if (key1 > key2) {
                return 1;
            } else if (key1 < key2) {
                result = -1;
            }
            return reverse ? -result : result;
        });
    };

    /**
     * Calls func(item) for each item
     * @param func Function, should accept item
     */
    sclient.ObservableCollection.prototype.each = function(func) {
        for (var i = 0; i < this.items.length; i+=1) {
            func(this.items[i]);
        }
    };

    //TODO Refactor notify() and ignore() shortcuts in Observables

    /**
     * Shorcut for on("change", listener)
     * @param listenerFunc
     */
    sclient.ObservableCollection.prototype.notify = function(listenerFunc) {
        this.on("change", listenerFunc);
    };
    /**
     * Shorcut for off("change", listener)
     * @param listenerFunc
     */
    sclient.ObservableCollection.prototype.ignore = function(listenerFunc) {
        this.off("change", listenerFunc);
    };

}());

/**
 * Created Created by Igor Zalutsky on 17.08.12 at 12:03
 */

(function() {
    "use strict";
    // publishing namespace
    if (!window.sclient) {
        window.sclient = {};
    }
    var sclient = window.sclient;

    /**
     * Property that notifies listeners when it's value changes through set()
     * @param initialValue
     * @constructor
     */
    sclient.ObservableProperty = function(initialValue) {
        this.value = initialValue;
        this.listeners = {};
    };

    // Extending EventEmitter
    sclient.ObservableProperty.inheritFrom(sclient.EventEmitter);

    /**
     * Returns property value
     * @return {*}
     */
    sclient.ObservableProperty.prototype.get = function(){
        return this.value;
    };
    /**
     * Sets property value, notifies listeners
     * @param newValue
     */
    sclient.ObservableProperty.prototype.set = function(newValue){
        if (this.value !== newValue) {
            this.value = newValue;
            this.emit("change");
        }
    };

    /**
     * Shorcut for on("change", listener)
     * @param listenerFunc
     */
    sclient.ObservableProperty.prototype.notify = function(listenerFunc) {
        this.on("change", listenerFunc);
    };

    /**
     * Shorcut for off("change", listener)
     * @param listenerFunc
     */
    sclient.ObservableProperty.prototype.ignore = function(listenerFunc) {
        this.off("change", listenerFunc);
    };


}());
/**
 * Created by Igor Zalutsky on 17.08.12 at 12:32
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.sclient) {
        window.sclient = {};
    }
    var sclient = window.sclient;

    sclient.Connector = function(url, callback) {
        //TODO params validation in Connector
        this.url = url;
        this.callback = callback;
        this.minTiming = 10;
        this.maxTiming = 1000;
        this.timing = 0;
        this.cacheSize = 10;
        this.timingCache = [];
        this.isStarted = false;

    };

    sclient.Connector.prototype.start = function(){
        if (!this.isStarted) {
            this.isStarted = true;
            this.runLoop();
        }
        return this;
    };

    sclient.Connector.prototype.stop = function(){
        this.isStarted = false;
        return this;
    };

    sclient.Connector.prototype.runLoop = function(){
        var that = this;
        this.request();
        var timingSum = 0;
        this.timingCache.forEach(function(value){
            timingSum += value;
        });
        var averageTiming = timingSum > 0 ? timingSum / this.timingCache.length : 0;    //fixing division by zero
        var nextTiming = Math.min(Math.max(this.minTiming, averageTiming), this.maxTiming);
        if (this.isStarted) {
            setTimeout(function(){
                that.runLoop();
            }, nextTiming);
        }
    };

    sclient.Connector.prototype.request = function(){
        var that = this;
        var start = new Date();
        $.ajax(this.url, {
            crossDomain: true,
            dataType: "jsonp"
        }).done(function(data){
                var end = new Date();
                var timing = end - start;
                that.timingCache.push(timing);
                if (that.timingCache.length > that.cacheSize) {
                    that.timingCache.shift();
                }
                that.callback(data);
            }).fail(function(err){
                throw new Error("Request failed");
            });
    };

}());

/**
 * Created by Igor Zalutsky on 17.08.12 at 12:07
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.sclient) {
        window.sclient = {};
    }
    var sclient = window.sclient;

    var con = new sclient.Connector("http://eris.generation-p.com/test/get-shapes.do", function(data) {
        console.log(con.timingCache);
    }).start();


}());
