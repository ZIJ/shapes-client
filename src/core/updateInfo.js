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
        this.created = {};  // descriptors of new models
        this.changed = {};  // map of changed properties
        this.deleted = {};  // set of deleted ids

        var info = this;
        var ids = {};       // set of available ids

        function byId(id) {             //makes predicate by id
            return function(item) {
                return item.id === id;
            };
        }

        descriptors.forEach(function(descriptor){
            var id = descriptor.id;
            ids[id] = id;
            var model = models.by(byId(id));
            if (model) {
                var diff = info.difference(descriptor, model);
                if (diff) {
                    info.changed[id] = diff;
                }
            } else {
                info.created[id] = descriptor;
            }
        });

        models.each(function(model){
            if (ids[model.id] === undefined){
                info.deleted[model.id] = model.id;
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
        var diff = {};
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
