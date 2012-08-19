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
    sclient.squareSize = 100;

    sclient.appModel = new sclient.AppModel();

    sclient.update = function(data){
        console.log(data);
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

    //TODO remove polling time limit
    setTimeout(function(){
        sclient.poll.stop();
    }, 10000);

    sclient.transmitter = new sclient.Transmitter(sclient.baseUrl, {
        save: sclient.saveAction,
        remove: sclient.removeAction
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
    });


}());
