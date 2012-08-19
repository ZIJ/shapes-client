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
