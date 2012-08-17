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
    sclient.url = "http://eris.generation-p.com/test/get-shapes.do";

    sclient.models = new sclient.ObservableCollection();

    sclient.update = function(data){

        var info = new sclient.UpdateInfo(data, sclient.models);
        console.log(info);

        info.created.forEach(function(descriptor){
            var id = descriptor.id;
            var model = new sclient.ShapeModel(id, descriptor);
            sclient.models.add(model);
        });

        info.deleted.forEach(function(id) {
            var predicate = sclient.byId(id);
            var model = sclient.models.by(predicate);
            if (model) {
                sclient.models.remove(model);
            }
        });

        info.changed.forEach(function(descriptor){
            var id = descriptor.id;
            var predicate = sclient.byId(id);
            var model = sclient.models.by(predicate);
            model.assign(descriptor);
        });

    };

    sclient.models.add(new sclient.ShapeModel(8, {size:200, x:3}));
    sclient.models.add(new sclient.ShapeModel(11));

    var con = new sclient.Connector(sclient.url, sclient.update).start();

    setTimeout(function(){
        con.stop();
    },2000);







}());
