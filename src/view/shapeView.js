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
        this.isVisible = false;
        this.model = shapeModel;
        this.parentNode = null;

        this.node = document.createElement("div");
        this.node.innerHTML = "test text";
        $(this.node).css("position", "absolute");
        $(this.node).css("border", "1px solid #000000");
        if (this.node.userId === sclient.userId){
            $(this.node).draggable();
        }


        this.update();
    };

    // Extending BaseView
    sclient.ShapeView.inheritFrom(sclient.BaseView);

    sclient.ShapeView.prototype.update = function(){
        var wrapped = $(this.node);
        wrapped.css("background-color", this.model.color.get());
        wrapped.css("left", this.model.x.get());
        wrapped.css("top", this.model.y.get());
        wrapped.css("width", this.model.size.get());
        wrapped.css("height", this.model.size.get());
    };


}());
