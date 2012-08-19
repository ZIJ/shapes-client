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
