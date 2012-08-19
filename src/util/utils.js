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

    /**
     * returns a "by id" predicate
     * @param id
     * @return {Function}
     */
    sclient.byId = function(id) {
        return function(item) {
            return item.id === id;
        };
    };
    /**
     * Returns uniform random integer between min and max
     * @param min
     * @param max
     * @return {Number}
     */
    sclient.randomInt = function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /**
     * Returns a random color string like this: "rgb(0,255,255)"
     * @return {String}
     */
    sclient.randomColor = function(){
        var colorString = "rgb(";
        for (var i = 0; i < 3; i+=1){
            colorString += sclient.randomInt(0, 255) + ",";
        }
        //removing last comma
        return colorString.substring(0, colorString.length - 2) + ")";
    };


}());
