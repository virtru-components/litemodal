/**
 *************************************************************************** 
 * File Name...: litemodal/lib/container.js
 * Purpose.....: Provide a container for dialog windows, and manage the
 *               data, including the placement.
 * Author......: Ramon C. Gonzales
 *************************************************************************** 
 */

/**
 * Module dependencies.
 */
var Emitter = require('emitter');
var $ = require('jquery');

/**
 * Return a new `ModalContainer` with the given `options`.
 *
 * @param {Object|Element} options
 * @return {ModalContainer}
 * @api public
 */
function ModalContainer(data, options) {
  options = options || {};
  this.options = options;
  this.modalData = data;
  this.modalContainer = null;
  this.modalWrap = null;
  this.modalPlate = null;
  this.dimension = {};
  return this;
}

/**
 * Mixin emitter.
 */
Emitter(ModalContainer.prototype);

ModalContainer.init = function(data, options) {
  return new ModalContainer(data, options);
};

ModalContainer.prototype.create = function() {
  // Load the template
  var modalContainer = $('<div>')
        .attr('id', 'litemodal-container')
        .addClass('litemodal-container hide')
        .css({
          "position": "absolute",
          "top": "0",
          "left": "0",
          "z-index": "2020"
        });
  var modalWrap = $('<div>')
        .attr('id', 'litemodal-wrap')
        .addClass('litemodal-wrap hide')
        .css({
          "position": "absolute",
          "top": "0",
          "left": "0",
          "background-color": "#000000",
          "z-index": "2021"
        });
  modalWrap.appendTo(modalContainer);
  // The modalWrap will 'host' the modalData.  If a title is to be added 
  //(later), then either add to modalWrap or to modalContainer.

  // Attach a modalPlate -- to contain the modalData.  The modalPlate 
  // will re-size to the modalData, and center itself within the viewport
  var modalPlate = $('<div></div')
        .attr('id', 'litemodal-plate')
        .addClass('litemodal-plate hide')
        // Notes: margin of auto needs !DOCTYPE for IE8
        .css({
          "position": "absolute",
          "top": "0",
          "left": "0",
          "margin": "auto",
          "z-index": "2022"
        });
  modalPlate.appendTo(modalWrap);

  // Attach the modal-data to the modal-plate
  this.modalData.appendTo(modalPlate);

  // Update the properties
  this.modalContainer = modalContainer;
  this.modalWrap = modalWrap;
  this.modalPlate = modalPlate;
  return this;
};

ModalContainer.prototype.render = function() {
  var modalContainer = this.modalContainer;
  var self = this;

  // Calculate dimensions and set the dimension and position of data
   this.calculateDimensions();
   this.setPosition();
  // Un-hide the elements
  this.modalPlate.removeClass('hide');
  this.modalWrap.removeClass('hide');
  this.modalContainer.removeClass('hide');
};

ModalContainer.prototype.calculateDimensions = function() {
  var minw = 60;
  var minh = 80;
  // Get the inner dimensions of the view-port
  var v = {};
  v.x = $(document).innerWidth();
  v.y = $(document).innerHeight();
  // Get the outer dimensions of the modal-data
  var m = {};
  m.x = this.modalData.outerWidth(true);
  m.y = this.modalData.outerHeight(true);
  // Calculate the correct placement
  var top = (v.y - m.y) / 2;
  var left = (v.x - m.x) / 2;
  var width = (m.x < minw)? minw : m.x;
  var height = (m.y < minh)? minh : m.y;
  this.dimension = {
    top: top,
    left: left,
    width: width,
    height: height
  };
  return this;
};

ModalContainer.prototype.setPosition = function() {
  var Dimension = this.dimension;
  var cOffset = 5;
  var cTop = Dimension.top - cOffset;
  var cLeft = Dimension.top - cOffset;
  var cssDimension = {
    "top": Dimension.top + "px",
    "left": Dimension.left + "px",
    "width": Dimension.width + "px",
    "height": Dimension.height + "px"
  };
//  this.modalPlate.css(cssDimension);
//  this.modalWrap.css(cssDimension);
  this.modalContainer.css(cssDimension);
  return this;
};

/**
 * Show the ModalContainer.
 *
 * @return {ModalContainer}
 * @api public
 */
ModalContainer.prototype.show = function() {
  this.modalContainer.removeClass('hide')
                     .addClass('modal')
                     .show();
  this.modalWrap.removeClass('hide').show();
  this.modalPlate.removeClass('hide').show();
  return this;
};

ModalContainer.prototype.bindEvents = function(Dialog) {
  var closeClass = this.options.closeClass;
  // Listen for the 'close' click event
  var self = this;
  // Attach click events to 'close' class elements
  this.modalContainer.find(closeClass).click(function() {
    Dialog.close();
    return false;
  });
};

ModalContainer.prototype.close = function() {
  var self = this;
  this.modalContainer.addClass('hide').hide().remove();
};

module.exports = ModalContainer;

