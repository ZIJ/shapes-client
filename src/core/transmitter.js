/**
 * Created by Igor Zalutsky on 19.08.12 at 15:12
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.sclient) {
        window.sclient = {};
    }
    var sclient = window.sclient;

    /**
     * Can send jsonp requests to urls constructed from baseUrl and action name. Provides corresponding methods.
     * @param baseUrl
     * @param actions   object with keys as action names and values as parts to be added to baseUrl
     * @constructor
     */
    sclient.Transmitter = function(baseUrl, actions) {
        var transmitter = this;
        this.baseUrl = baseUrl;
        this.actions = actions || {};
        for (var actionName in actions){
            if (actions.hasOwnProperty(actionName)){
                this.addMethod(actionName);
            }
        }
    };
    /**
     * Adds method with given name that invokes send (name, data)
     * @param name
     * @return {*}
     */
    sclient.Transmitter.prototype.addMethod = function(name){
        var transmitter = this;
        transmitter[name] = function(data){
            return transmitter.send(name, data);
        };
        return this;
    };

    /**
     * Sends jsonp request to specified action
     * @param actionName
     * @param data
     * @return {*}
     */
    sclient.Transmitter.prototype.send = function(actionName, data) {
        if (typeof this.actions[actionName] === "string") {
            var fullUrl = this.baseUrl + this.actions[actionName];
            return $.ajax({
                url: fullUrl,
                data: data,
                crossDomain: true,
                dataType: "jsonp"
            }).fail(function(){
                sclient.report("Failed request to " + fullUrl);
            });
        } else {
            sclient.report("Can't find action " + actionName);
        }
    };


}());
