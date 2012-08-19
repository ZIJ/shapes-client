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
