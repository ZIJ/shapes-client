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

    var con = new sclient.Connector("http://eris.generation-p.com/test/get-shapes.do", function(data) {
        console.log(con.timingCache);
    }).start();


}());
