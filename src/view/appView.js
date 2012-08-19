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
        var view = this;
        this.model = appModel;
        this.listeners = {};
        this.isVisible = false;

        this.shapeViews = new sclient.ObservableCollection();

        this.createButton = $("#createButton");
        this.createButton.click(function(){
            view.emit("create");
        });
    };

    // Extending BaseView
    sclient.AppView.inheritFrom(sclient.BaseView);

}());
