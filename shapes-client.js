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
    sclient.randomColorOld = function(){
        var colorString = "rgb(";
        for (var i = 0; i < 3; i+=1){
            colorString += sclient.randomInt(0, 255) + ",";
        }
        //removing last comma
        return colorString.substring(0, colorString.length - 2) + ")";
    };

    sclient.randomColor = function(){
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i+=1 ) {
            color += letters[Math.round(Math.random() * 15)];
        }
        return color;
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
     * Adds an item. Causes "add" event.
     * @param item
     * @return {*}
     */
    sclient.ObservableCollection.prototype.add = function(item){
        if (!this.has(item)) {
            this.items.push(item);
            this.emit("add", item);
        }
        return this;
    };

    /**
     * Removes an item. Causes "remove" event
     * @param item
     * @return {*}
     */
    sclient.ObservableCollection.prototype.remove = function(item){
        var index = this.items.indexOf(item);
        if (index >= 0) {
            this.items.splice(index, 1);
            this.emit("remove", item);
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
            if (typeof predicate !== "function") {
                sclient.report("Predicate should be function");
            }
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
                if (this[name] instanceof sclient.ObservableProperty) {
                    this[name].set(properties[name]);
                }
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

/**
 * Created by Igor Zalutsky on 17.08.12 at 15:52
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.sclient) {
        window.sclient = {};
    }
    var sclient = window.sclient;

    /**
     * Base class for all Views, extends EventEmitter. Provides common rendering logic.
     * @constructor
     */
    sclient.BaseView = function() {
        this.listeners = {};
        this.isVisible = false;
    };

    // BaseView extends EventEmitter
    sclient.BaseView.inheritFrom(sclient.EventEmitter);


    /**
     * Renders a view to specified DOM node
     * @param element
     * @return {*}
     */
    sclient.BaseView.prototype.renderTo = function(element) {
        //TODO param validation in renderTo()
        this.parentNode = element;
        return this.show();
    };
    /**
     * Appends view to its parent node
     * @return {*}
     */
    sclient.BaseView.prototype.show = function() {
        if (!this.isVisible){
            if (!this.parentNode) {
                sclient.report("Parent node unknown. Call renderTo() first.");
            }
            this.parentNode.appendChild(this.node);
            this.isVisible = true;
        }
        return this;
    };
    /**
     * Removes view from DOM
     */
    sclient.BaseView.prototype.hide = function() {
        if (this.isVisible && this.parentNode) {
            //TODO Find out why removeChild causes DOM Exception 8
            try {
                this.parentNode.removeChild(this.node);
            } catch (e) {}
            this.isVisible = false;
        }
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

/**
 * Created by Igor Zalutsky on 17.08.12 at 14:27
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.sclient) {
        window.sclient = {};
    }
    var sclient = window.sclient;

    /**
     * Describes difference between array of Shape descriptors and ObservableCollection of ShapeModels
     * @constructor
     */
    sclient.UpdateInfo = function(descriptors, models){
        this.created = [];  // new models
        this.changed = [];  // changed properties
        this.deleted = [];  // deleted ids

        var info = this;
        var ids = {};       // set of available ids

        descriptors.forEach(function(descriptor){
            var id = descriptor.id;
            ids[id] = id;
            var model = models.by(sclient.byId(id));
            if (model) {
                var diff = info.difference(descriptor, model);
                if (diff) {
                    info.changed.push(diff);
                }
            } else {
                info.created.push(descriptor);
            }
        });

        models.each(function(model){
            if (ids[model.id] === undefined){
                info.deleted.push(model.id);
            }
        });

        return info;
    };
    /**
     * Lists all changed properties
     * @param descriptor
     * @param model
     * @return {Object}
     */
    sclient.UpdateInfo.prototype.difference = function(descriptor, model) {
        var diff = {id: descriptor.id};
        var changed = false;
        for (var propName in descriptor) {
            if (descriptor.hasOwnProperty(propName) &&
                model[propName] instanceof sclient.ObservableProperty){
                if (model[propName].get() !== descriptor[propName]){
                    diff[propName] = descriptor[propName];
                    changed = true;
                }
            }
        }
        return changed ? diff : null;
    };


}());

/**
 * Created by Igor Zalutsky on 19.08.12 at 18:29
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.sclient) {
        window.sclient = {};
    }
    var sclient = window.sclient;
    /**
     * Model of entire application. Contains models of Shapes and provides convenience methods.
     * @constructor
     */
    sclient.AppModel = function(){

        this.shapeModels = new sclient.ObservableCollection();

    };

    // Extending BaseModel
    sclient.AppModel.inheritFrom(sclient.BaseModel);

    /**
     * Find a model with given id
     * @param id
     * @return {*}
     */
    sclient.AppModel.prototype.byId = function(id){
        var num = Number(id);
        return this.shapeModels.by(function(model){
            return model.id === num;
        });
    };

    /**
     * Check if model with given id is present in shapeModels
     * @param id
     * @return {Boolean}
     */
    sclient.AppModel.prototype.hasId = function(id){
        return this.byId(id) ? true : false;
    };

    /**
     * Updates an existing ShapeModel or creates a new one
     * @param descriptor Object listing properties of new ShapeModel. ID is required.
     */
    sclient.AppModel.prototype.save = function(descriptor){
        var id = descriptor.id;
        var model = this.byId(id);
        if (model){
            model.assign(descriptor);
        } else {
            model = new sclient.ShapeModel(id, descriptor);
            this.shapeModels.add(model);
        }
    };

    /**
     * Remove model from shapeModels
     * @param id
     */
    sclient.AppModel.prototype.remove = function(id){
        var model = this.byId(id);
        if (model){
            this.shapeModels.remove(model);
            console.log("removed model " + id);
        } else {
            sclient.report("No model with id " + id);
        }
    };


}());

/**
 * Created by Igor Zalutsky on 17.08.12 at 14:01
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.sclient) {
        window.sclient = {};
    }
    var sclient = window.sclient;

    sclient.ShapeModel = function(id, properties){
        this.id = this.newId(id);
        this.userId = this.newProp(sclient.userId);
        this.x = this.newProp(0);
        this.y = this.newProp(0);
        this.size = this.newProp(100);
        this.color = this.newProp("rgb(255, 0, 0)");
        if (properties !== undefined) {
            this.assign(properties);
        }

    };

    // Extending BaseModel
    sclient.ShapeModel.inheritFrom(sclient.BaseModel);

}());

/**
 * Created by Igor Zalutsky on 19.08.12 at 17:19
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.sclient) {
        window.sclient = {};
    }
    var sclient = window.sclient;

    /**
     * View of etire application
     * @constructor
     */
    sclient.AppView = function(appModel){
        var appView = this;
        this.model = appModel;
        this.listeners = {};
        this.isVisible = false;

        sclient.userId = prompt("Enter your username, please", sclient.userId);

        this.shapeViews = new sclient.ObservableCollection();

        this.createButton = $("#createButton");
        this.createButton.click(function(){
            appView.emit("create");
        });

        this.removeAllButton = $("#removeAllButton");
        this.removeAllButton.click(function(){
            if (confirm("This will delete all your lovely squares. Are you sure you won't regret?")){
                // fixing server bug - remove-shapes.do removes all shapes
                appView.shapeViews.each(function(shapeView){
                    if (shapeView.model.userId.get() === sclient.userId){
                        shapeView.isRemoved = true;
                        appView.emit("remove", shapeView.model.id);
                    }
                });
            }
        });

        this.trash = $("#trash");
        this.trash.droppable();
        this.trash.bind("drop", function(event, ui){
            console.log("drop");
            var id = Number(ui.draggable.attr("data-id"));
            var view = appView.shapeViews.by(function(shapeView){
                return shapeView.model.id === id;
            });
            view.isRemoved = true;
            appView.emit("remove", id);
        });


        appModel.shapeModels.on("add", function(collection, shapeModel){
            appView.createView(shapeModel);
        });

        appModel.shapeModels.on("remove", function(collection, shapeModel){
            appView.removeView(shapeModel);
        });
    };

    // Extending BaseView
    sclient.AppView.inheritFrom(sclient.BaseView);

    /**
     * Creates a view of given ShapeModel and adds it to shapeViews
     * @param shapeModel
     */
    sclient.AppView.prototype.createView = function(shapeModel){
        var appView = this;
        var shapeView = new sclient.ShapeView(shapeModel);
        shapeView.on("change", function(){
            var descriptor = shapeView.getDescriptor();
            appView.emit("save", descriptor);
        });
        this.shapeViews.add(shapeView);
    };

    /**
     * Removes view of given ShapeModel
     * @param shapeModel
     */
    sclient.AppView.prototype.removeView = function(shapeModel){
        var shapeView = this.shapeViews.by(function(shapeView){
            return shapeView.model === shapeModel;
        });
        if (shapeView) {
            shapeView.remove();
            this.shapeViews.remove(shapeView);
        } else {
            sclient.report("No view for given model");
        }
    };

}());

/**
 * Created by Igor Zalutsky on 17.08.12 at 15:54
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.sclient) {
        window.sclient = {};
    }
    var sclient = window.sclient;

    /**
     * View of single Shape
     * @param shapeModel
     * @constructor
     */
    sclient.ShapeView = function(shapeModel){
        //TODO Param validation in ShapeView
        var view = this;
        var model = shapeModel;
        this.listeners = {};

        this.model = shapeModel;
        this.model.x.notify(function(){
            view.updateX();
        });
        this.model.y.notify(function(){
            view.updateY();
        });
        this.model.color.notify(function(){
            view.updateColor();
        });

        this.container = $("#shapes");
        this.square = $(document.createElement("div"));
        this.square.attr("data-id",this.model.id);
        this.square.addClass("shape");
        this.square.css("width", sclient.squareSize + "px");
        this.square.css("height", sclient.squareSize + "px");
        this.container.append(this.square);

        this.isRemoved = false;
        this.isDragging = false;
        if (this.model.userId.get() === sclient.userId) {
            this.square.draggable();
            this.square.dblclick(function(){
                view.square.css("background-color", sclient.randomColor());
                view.emit("change");
            });
        }
        this.square.bind("dragstart", function(){
            view.isDragging = true;
        });
        this.square.bind("dragstop", function(){
            console.log("dragstop");
            if (!view.isRemoved){
                view.emit("change");
                view.isDragging = false;
            }
        });

        this.updateX();
        this.updateY();
        this.updateColor();
    };

    // Extending BaseView
    sclient.ShapeView.inheritFrom(sclient.BaseView);

    /**
     * Returns a descriptor of Shape from actual markup
     * @return {Object}
     */
    sclient.ShapeView.prototype.getDescriptor = function(){
        var position = this.square.position();
        return {
            id: this.square.attr("data-id"),
            userId: sclient.userId,
            x: position.left,
            y: position.top,
            size: this.square.width(),
            color: this.square.css("background-color")
        };
    };

    sclient.ShapeView.prototype.remove = function(){
        this.square.remove();
    };

    sclient.ShapeView.prototype.updateX = function(){
        if (!this.isDragging){
            this.square.css("left", this.model.x.get());
        }
    };

    sclient.ShapeView.prototype.updateY = function(){
        if (!this.isDragging){
            this.square.css("top", this.model.y.get());
        }
    };

    sclient.ShapeView.prototype.updatePosition = function(){
        this.square.position({
            of: this.container,
            offset: this.model.x.get() + " " + this.model.y.get()
        });
    };

    sclient.ShapeView.prototype.updateColor = function(){
        this.square.css("background-color", this.model.color.get());
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

    sclient.userId = "Igor Zalutsky";

    sclient.baseUrl = "http://eris.generation-p.com/test/";
    sclient.getAction = "get-shapes.do";
    sclient.saveAction = "save-shape.do";
    sclient.removeAction = "remove-shape.do";
    sclient.removeAllAction = "remove-shapes.do";
    sclient.squareSize = 100;

    sclient.appModel = new sclient.AppModel();

    sclient.update = function(data){
        //console.log(data);
        var ids = {};
        sclient.appModel.shapeModels.each(function(model){
            ids[model.id] = model;
        });
        data.forEach(function(descriptor){
            sclient.appModel.save(descriptor);
            delete ids[descriptor.id];
        });
        for (var id in ids){
            if (ids.hasOwnProperty(id)){
                sclient.appModel.remove(id);
            }
        }
    };

    sclient.pollUrl = sclient.baseUrl + sclient.getAction;
    sclient.poll = new sclient.Poll(sclient.pollUrl, sclient.update).start();

    /*

    setTimeout(function(){
        sclient.poll.stop();
    },10000);

    */

    sclient.transmitter = new sclient.Transmitter(sclient.baseUrl, {
        save: sclient.saveAction,
        remove: sclient.removeAction,
        removeAll: sclient.removeAllAction
    });

    $(document).ready(function(){
        sclient.appView = new sclient.AppView(sclient.appModel);
        sclient.appView.on("create", function(){
            sclient.transmitter.save({
                userId: sclient.userId,
                color: sclient.randomColor(),
                size: sclient.squareSize,
                x: sclient.randomInt(100, 800),
                y: sclient.randomInt(100, 600)
            });
        });

        sclient.appView.on("remove", function(shapeView, id){
            sclient.transmitter.remove({
                userId: sclient.userId,
                id: id
            });
        });

        sclient.appView.on("removeAll", function(){
            sclient.transmitter.removeAll({
                userId: sclient.userId
            });
        });

        sclient.appView.on("save", function(shapeView, descriptor){
           sclient.transmitter.save(descriptor);
        });
    });


}());
