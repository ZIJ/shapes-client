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