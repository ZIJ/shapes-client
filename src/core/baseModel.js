/**
 * Created by Igor Zalutsky on 17.08.12 at 13:05
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.sclient) {
        window.sclient = {};
    }
    var sclient = window.sclient;

    /**
     * Base classs for entity model
     * @param properties Object with initial property values (id required) or id
     * @constructor
     */
    sclient.BaseModel = function(id, properties) {
        //this.id = 0;
    };
    /**
     * Checks ObservableProperties presence and sets their values
     * @param properties
     */
    sclient.BaseModel.prototype.assign = function(properties) {
        if (typeof properties !== "object") {
            sclient.report("Properties should be object");
        }
        for (var name in properties){
            if (properties.hasOwnProperty(name)) {
                if (!(this[name] instanceof sclient.ObservableProperty)) {
                    sclient.report("No such ObservableProperty: " + name);
                }
                this[name].set(properties[name]);
            }
        }
    };
    /**
     * Checks given ID validity and returns it
     * @param id
     * @return {*}
     */
    sclient.BaseModel.prototype.newId = function(id) {
        if (typeof id !== "number") {
            sclient.report("ID should be number");
        } else if (id < 0) {
            sclient.report("ID should be positive");
        } else if (id !== Math.floor(id)) {
            sclient.report("ID should be integer");
        }
        return id;
    };
    /**
     * Creates ObservableProperty with given initial value
     * @param initialValue
     * @return {sclient.ObservableProperty}
     */
    sclient.BaseModel.prototype.newProp = function(initialValue){
        return new sclient.ObservableProperty(initialValue);
    };

}());
