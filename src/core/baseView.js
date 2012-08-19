/**
 * Created by Igor Zalutsky on 17.08.12 at 15:52
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.sclient) {
        window.sclient = {};
    }
    var sclient = window.sclient;

    /**
     * Base class for all Views, extends EventEmitter. Provides common rendering logic.
     * @constructor
     */
    sclient.BaseView = function() {
        this.listeners = {};
        this.isVisible = false;
    };

    // BaseView extends EventEmitter
    sclient.BaseView.inheritFrom(sclient.EventEmitter);


    /**
     * Renders a view to specified DOM node
     * @param element
     * @return {*}
     */
    sclient.BaseView.prototype.renderTo = function(element) {
        //TODO param validation in renderTo()
        this.parentNode = element;
        return this.show();
    };
    /**
     * Appends view to its parent node
     * @return {*}
     */
    sclient.BaseView.prototype.show = function() {
        if (!this.isVisible){
            if (!this.parentNode) {
                sclient.report("Parent node unknown. Call renderTo() first.");
            }
            this.parentNode.appendChild(this.node);
            this.isVisible = true;
        }
        return this;
    };
    /**
     * Removes view from DOM
     */
    sclient.BaseView.prototype.hide = function() {
        if (this.isVisible && this.parentNode) {
            //TODO Find out why removeChild causes DOM Exception 8
            try {
                this.parentNode.removeChild(this.node);
            } catch (e) {}
            this.isVisible = false;
        }
    };


}());
