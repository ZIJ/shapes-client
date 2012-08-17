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

    /**
     * Checks if it contains item for which predicate() is true
     * @param predicate Function returning Boolean
     * @return {Boolean}
     */
    sclient.ObservableCollection.prototype.any = function(predicate){
        //TODO param validation in ObservableCollection.any()
        var contains = this.by(predicate);
        return contains ? true : false;
    };

    /**
     * Checks if it contains item for which predicate() is true
     * @param predicate Function returning Boolean
     * @return {*}
     */
    sclient.ObservableCollection.prototype.by = function(predicate){
        //TODO param validation in ObservableCollection.by()
        for (var i = 0; i < this.items.length; i+=1) {
            if (predicate(this.items[i])){
                return this.items[i];
            }
        }
        return null;
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
