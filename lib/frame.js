/**
 *************************************************************************** 
 * File Name...: dialog-lite/lib/frame.js
 * Purpose.....: Provide a frame for dialog windows, and manage the frame.
 * Author......: Ramon C. Gonzales
 *************************************************************************** 
 */
/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var $ = require('jquery');

/**
 * Return a new `ModalFrame` with the given `options`.
 *
 * @param {Object|Element} options
 * @return {ModalFrame}
 * @api public
 */
function ModalFrame(options) {
  options = options || {};
  this.target = options.target || 'body';
  this.options = options;
  this.modalHousing = null;
  this.modalFrame = null;
  this.isAttachedOverlay = false;
  this.isAttachedContainer = false;
  return this;
}

/**
 * Mixin emitter.
 */
Emitter(ModalFrame.prototype);

ModalFrame.init = function(options) {
  return new ModalFrame(options);
};

ModalFrame.prototype.create = function() {
  var modalHousing = null;
  var modalFrame = null;
  if (this.options.useFrame) {
    // Create a 'frame' layer to contain the rest of the modal framework
    // if an iframe is needed later, then will simply add it then
    var modalFrame = $('<div></div>')
          .attr('id', "litemodal-frame")
          .addClass('litemodal-frame hide')
          .css({
            "position": "fixed",
            "top": "0",
            "left": "0",
            "height": "100%",
            "width": "100%",
            "z-index": "2001"
          });
    if (this.options.useFrameHousing) {
       // Create a 'housing' to house the frame and everything else
      var modalHousing = $('<div></div>')
            .attr('id', "litemodal-housing")
            .addClass('litemodal-housing hide')
            .css({
              "position": "fixed",
              "top": "0",
              "left": "0",
              "height": "100%",
             "width": "100%",
              "z-index": "2000"
            });
      // Then put an 'umbrella' on (i.e.: 'house') the modal-frame
      modalFrame.appendTo(modalHousing);
    }
  } else {
    this.options.useFrameHousing = false;
  }
  // Update the properties
  this.modalHousing = modalHousing;
  this.modalFrame = modalFrame;
  return this;
};

ModalFrame.prototype.render = function() {
  this.modalFrame.removeClass('hide');
  this.modalHousing.removeClass('hide');
  // Append the modal frame to 'target' (usually, the html 'body')
  if (this.options.useFrame) { 
    if (this.options.useFrameHousing) {
      this.modalHousing.appendTo(this.target);
    } else {
    this.modalFrame.appendTo(this.target);
    }
  }
  return this;
};

/**
 * Show the ModalFrame.
 *
 * @return {ModalFrame}
 * @api public
 */
ModalFrame.prototype.show = function(){
  // Append the modal housing or frame to 'target' (usually, the html 'body')
  if (this.useFrame) {
    (this.useFrameHousing)? this.modalHousing.show() : this.modalFrame.show();
  }
//  this.open = true;
  return this;
};

ModalFrame.prototype.bindEvents = function() {
};

ModalFrame.prototype.close = function() {
  if (this.options.useFrame) {
    (this.useFrameHousing)? this.modalHousing.hide().remove() : this.modalFrame.hide().remove();
  }
  return this;
};

/**
 * Get where to house the overlay
 */
ModalFrame.prototype.getOverlayContainer = function() {
  return (this.useFrame)? this.modalFrame : this.target;
};

/**
 * Get the main modal-container
 */
ModalFrame.prototype.getModalContainer = function() {
  return (this.useFrame)? this.modalFrame : this.target;
};

ModalFrame.prototype.attachOverlay = function(modalOverlay) {
  if (this.isAttachedOverlay) return this;
  if (this.options.useFrame) {
    // Add modalOverlay as the first-child of the frame
    var element = modalOverlay.element;
    this.modalFrame.prepend(element);
  } else {
    // Assume that the overlay is being added before the container
    element.appendTo(this.target);
  }
  this.isAttachedOverlay;
  return this;
};

ModalFrame.prototype.attachContainer = function(modalContainer) {
  if (this.isAttachedContainer) return this;
  if (this.options.useFrame) {
    // Add modalContainer as the last-child of the frame
    this.modalFrame.append(modalContainer.modalContainer);
  } else {
    // Assume that the overlay is being added before the container
    modalContainer.modalContainer.appendTo(this.target);
  }
  this.isAttachedContainer = true;
  return this;
};

module.exports = ModalFrame;

