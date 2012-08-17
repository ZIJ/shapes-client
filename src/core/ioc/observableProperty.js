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