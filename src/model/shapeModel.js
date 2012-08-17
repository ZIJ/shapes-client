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
