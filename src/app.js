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

    var models = new sclient.ObservableCollection();
    models.add(new sclient.ShapeModel(8, {size:200, x:3}));
    models.add(new sclient.ShapeModel(11));

    var con = new sclient.Connector("http://eris.generation-p.com/test/get-shapes.do", function(data) {
        var info = new sclient.UpdateInfo(data, models);
        console.log(info);
    }).start();

    setTimeout(function(){
        con.stop();
    },2000);







}());
