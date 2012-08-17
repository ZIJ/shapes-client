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
