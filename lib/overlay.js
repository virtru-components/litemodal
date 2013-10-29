/**
 *************************************************************************** 
 * File Name...: litemodal/lib/overlay.js
 * Purpose.....: Provide an overlay for dialog windows.
 * Author......: Ramon C. Gonzales
 *************************************************************************** 
 */
/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var $ = require('jquery');

/**
 * Return a new `Overlay` with the given `options`.
 *
 * @param {Object|Element} options
 * @return {Overlay}
 * @api public
 */
function Overlay(options) {
  Emitter.call(this);
  options = options || {};
  this.options = options;
  this.closable = options.closable;
  this.element = null;
  return this;
}

/**
 * Mixin emitter.
 */
Emitter(Overlay.prototype);

// Define constructor
Overlay.init = function(options) {
  return new Overlay(options);
};

Overlay.prototype.create = function() {
console.log('Overlay.create');
console.log(this);
  var overlayCss = this.options.overlayCss;
  var defaultCss = {
    "z-index": "2010",
    "height": "100%",
    "width": "100%"
  };
  var finalOverlayCss = $.extend({}, defaultCss, overlayCss);
  var element = $('<div></div>')
        .attr('id', 'litemodal-overlay')
        .addClass('litemodal-overlay hide')
        .css(finalOverlayCss);
  var closable = this.closable;
  this.element = element;
  return this;
};

Overlay.prototype.render = function() {
console.log('Overlay.render');
console.log(this);
  this.element.removeClass('hide');
  return this;
};

/**
 * Show the Overlay.
 *
 * @return {Overlay}
 * @api public
 */
Overlay.prototype.show = function(){
console.log('Overlay.show');
console.log(this);
  this.element.removeClass('hide').show();
  return this;
};

Overlay.prototype.bindEvents = function(Dialog) {
};

Overlay.prototype.close = function() {
console.log('Overlay.close');
  this.element.addClass('hide').hide().remove();
  return this;
};

module.exports = Overlay;

