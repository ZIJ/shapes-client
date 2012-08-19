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

    /**
     * Regularly sends requests to given url, auto-optimizes to network perfomance
     * @param url
     * @param callback  will be called with response data as first param
     * @constructor
     */
    sclient.Poll = function(url, callback) {
        //TODO params validation in Poll
        this.url = url;
        this.callback = callback;
        this.minTiming = 30;
        this.maxTiming = 1000;
        this.cacheSize = 10;
        this.timingCache = [];
        this.isStarted = false;

    };

    /**
     * Starts request loop
     * @return {*}
     */
    sclient.Poll.prototype.start = function(){
        if (!this.isStarted) {
            this.isStarted = true;
            this.runLoop();
        }
        return this;
    };

    /**
     * Stops request loop
     * @return {*}
     */
    sclient.Poll.prototype.stop = function(){
        this.isStarted = false;
        return this;
    };

    /**
     * Makes a request, then calculates delay until next step.
     */
    sclient.Poll.prototype.runLoop = function(){
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

    /**
     * Sends request
     */
    sclient.Poll.prototype.request = function(){
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
                sclient.report("Request failed");
            });
    };

}());
