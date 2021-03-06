/**
 *************************************************************************** 
 * File Name...: litemodal/lib/frame.js
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

/**
 * Create the contents and structure of the modal-frame
 */
ModalFrame.prototype.create = function() {
  var modalHousing = null;
  var modalFrame = null;
  var options = this.options;
  if (options.useFrame) {
    // Create a 'frame' layer to contain the rest of the modal framework
    modalFrame = $('<div>')
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
    if (options.useFrameHousing) {
      // Create a 'housing' to house the frame and everything else
      // if an iframe is needed later, then will simply add it then
      var modalHousing = $('<div>')
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
      //=================================================================//
//      // Put an 'iframe umbrella' around (ie: 'house') the modal-frame.
//      var modalHousing = $('<iframe>')
//            .attr('id', "litemodal-housing")
//            .addClass('litemodal-housing hide')
//            .css({
//              "position": "fixed",
//              "top": "0",
//              "left": "0",
//              "height": "100%",
//             "width": "100%",
//              "z-index": "2000"
//            });
//      // The following should work for both FF and Chrome -- for iframes;
//      // FF is a very finicky when it comes to manipulating iframes.
//      // The iframe will prevent 'cross-bleeding' issues with other dom-elements
//      modalHousing[0].addEventListener('load', function(e) {
//        var iframeBody = modalHousing.contents().find('body');
//        var innerContent = modalFrame.clone().wrap('<p>').parent().html();
//        iframeBody.html(innerContent);
//      });
    }
  } else {
    this.options.useFrameHousing = false;
  }
  // Update the properties
  this.modalHousing = modalHousing;
  this.modalFrame = modalFrame;
  return this;
};

/**
 * Render the modal-frame
 */
ModalFrame.prototype.render = function() {
  // Append the modal frame to 'target' (usually, the html 'body')
  var target = $(this.target);
  var options = this.options;
  if (options.useFrame) { 
    this.modalFrame.removeClass('hide');
    this.modalHousing.removeClass('hide');
    if (options.useFrameHousing) {
      this.modalHousing.appendTo(target);
    } else {
      this.modalFrame.appendTo(target);
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
  var options = this.options;
  if (options.useFrame) {
    (options.useFrameHousing)? this.modalHousing.show() : this.modalFrame.show();
  }
//  this.open = true;
  return this;
};

ModalFrame.prototype.bindEvents = function() {
};

ModalFrame.prototype.close = function() {
  var options = this.options;
  if (options.useFrame) {
    this.modalFrame.hide().remove();
    if (options.useFrameHousing) this.modalHousing.hide().remove() ;
  }
  return this;
};

/**
 * Get where to house the overlay
 */
ModalFrame.prototype.getOverlayContainer = function() {
  return (this.options.useFrame)? this.modalFrame : $(this.target);
};

/**
 * Get the main modal-container
 */
ModalFrame.prototype.getModalContainer = function() {
  return (this.options.useFrame)? this.modalFrame : $(this.target);
};

ModalFrame.prototype.attachOverlay = function(modalOverlay) {
  if (this.isAttachedOverlay) return this;
  var element = modalOverlay.element;
  if (this.options.useFrame) {
    // Add modalOverlay as the first-child of the frame
    this.modalFrame.prepend(element);
  } else {
    var target = $(this.target);
    // Assume that the overlay is being added before the container
    element.appendTo(target);
  }
  this.isAttachedOverlay = true;
  return this;
};

ModalFrame.prototype.attachContainer = function(modalContainer) {
  if (this.isAttachedContainer) return this;
  if (this.options.useFrame) {
    // Add modalContainer as the last-child of the frame
    this.modalFrame.append(modalContainer.modalContainer);
  } else {
    // Assume that the overlay is being added before the container
    var target = $(this.target);
    modalContainer.modalContainer.appendTo(target);
  }
  this.isAttachedContainer = true;
  return this;
};

module.exports = ModalFrame;

