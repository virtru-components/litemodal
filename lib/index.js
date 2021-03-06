/**
 ***************************************************************************
 * Filename...: litemodal/lib/index.js
 * Purpose....: Provide a simple and lite modal/dialog window.
 * Author.....: Ramon C. Gonzales
 *
 * Some basic requirements:
 *  1. Must have tweak-able background color for the overlay
 *  2. Must have an api to close the dialog
 *  3. Must have completely customizable css class names that it generates.
 *    == Need to verify and clarify on the specific details ==
 *  4. Must be plug-and-play compatible with simplemodal -- at least for
 *     the existing features that Virtru is currently using.
 *
 * Other features (TBD):
 *  1. Add the following options:
 *     - buttonSelectors: csv-list of selectors (class or ID's) to watch for.
 *     - onClick: callback - the function to call when buttons are clicked.
 *                - Parameters include the specific button that was clicked.
 ***************************************************************************
 */

/**
 ***************************************************************************
 * The modal dialog basic html structure, and object hierarchy:
 *  0. LiteModal: This object (part of this file) manages all the objects below.
 *  1. ModalFrame: Object consisting of 2 div elements
 *     -> modalHousing: (contains the frame divs), normally attaches to 'body'.
 *        : TBD: Create modalHousing as an 'iframe' -- to isolate contents
 *               from other similarly named classes from the DOM.
 *     --> modalFrame: (contains the modalOverlay and modalContainer divs)
 *  2. ModalOverlay: Object consisting of div elements
 *     ---> modalOverlay: Provides the overlay for dialogs.
 *  3. ModalContainer: Object consisting of div elements
 *     ---> modalContainer: (top-level container div)
 *     ----> modalWrap: (mid-level container div)
 *     -----> modalPlate:  (div that holds the modalData)
 *  4. The modal-data is the element passed in from the caller
 *     -----> modalData: The jquery-element to make modal (modal-content).
 ***************************************************************************
 */

var Emitter = require('emitter');
var $ = require('jquery');
var Overlay = require('./overlay');
var Container = require('./container');
var Frame = require('./frame');

$.fn.showModal = function(options) {
  return LiteModal.init(this, options).open();
};

/**
 * Define a new modal dialog object
 * @param {data}
 *   * {data} is the jquery-element to make modal
 */
function LiteModal(data, options) {
  Emitter.call(this);
  this.modalData = data;
  this.options = this.defineOptions(options);
  this.hiding = false;
  return this;
};

// inherit from Emitter
Emitter(LiteModal.prototype);

// Define constructor
LiteModal.init = function(element, options) {
  return new LiteModal(element, options);
};

/**
 * defineOptions()
 */
LiteModal.prototype.defineOptions = function(userOptions) {
  var closeClass = '.litemodal-close';
  var opacity = ("opacity" in userOptions)? 
        userOptions.opacity / 100 : 0.5 ;
  var backgroundColor = ("background-color" in userOptions)? 
        userOptions.background-color : '#ffffff';
  // set the default overlay-Css
  var overlayCss = { 
    "opacity": opacity, 
    "background-color": "#ffffff"
  };
  userOptions = userOptions || {};
  var defaults = {
    overlayID: null,
    overlayCss: overlayCss,
    closeClass: closeClass,
    close: true,
    target: 'body',
    onShow: null,
    onOpen: null,
    onClose: null,
    escClose: false,
    useFrameHousing: true,
    useFrame: true,
    title: '' 
  };
  var allOptions = $.extend({}, defaults, userOptions);
  // Sanity checks on options
  if (!allOptions.useFrame) allOptions.useFrameHousing = false;
  return allOptions;
};

/**
 * open dialog
 */
LiteModal.prototype.open = function(data) {
  if (data) { 
    this.modalData = data;
  } else {
   data = this.modalData;
  }
  this.create();
  this.render();

  // First display the frame
  this.modalFrame.show();

  // Call onOpen if defined
  var onOpen = this.options.onOpen;
  if ($.isFunction(onOpen)) {
    // run the onOpen callback
    var element = this.modalData;
    onOpen.apply(this, [element]);
  } else {
    this.show();
  }
  // Call onShow if defined
  var onShow = this.options.onShow;
  if ($.isFunction(onShow)) {
    // run the onShow callback
    var element = this.modalData;
    onShow.apply(this, [element] );
  }
  this.bindEvents();
  return this;
};

/**
 * create the frame
 */
LiteModal.prototype.create = function() {
  // Create the main frame
  var frameOptions = $.extend({}, this.options, {});
  var modalFrame = Frame.init(frameOptions);
  modalFrame.create();

  // Create the modal overlay, and attach to frame
  var overlayOptions = $.extend({}, this.options, { 
    closable: true
  });
  var modalOverlay = Overlay.init(overlayOptions);
  modalOverlay.create();
  modalFrame.attachOverlay(modalOverlay);

  // Create the modal container, and attach to frame
  var containerOptions = $.extend({}, this.options, { });
  var modalContainer = Container.init(this.modalData, containerOptions);
  modalContainer.create();
  modalFrame.attachContainer(modalContainer);

  // Update properties
  this.modalFrame = modalFrame;
  this.modalOverlay = modalOverlay;
  this.modalContainer = modalContainer;
  return this;
};

/**
 * Render the modal-dialog
 */
LiteModal.prototype.render = function() {
  // Attach the overlay to the frame
  this.modalFrame.attachOverlay(this.modalOverlay);
  // Attach the container to the frame
  this.modalFrame.attachContainer(this.modalContainer);
  // Complete the rendering
  this.modalFrame.render();
  this.modalOverlay.render();
  this.modalContainer.render();
  return this;
};

/**
 * show frame
 * Emits 'show' event
 */
LiteModal.prototype.show = function() {
  this.modalFrame.show();
  this.modalOverlay.show();
  this.modalContainer.show();
  // check if escape closable
  if (this.modalOverlay.closable) this.escapable();
  this.emit('show');
  return this;
};

LiteModal.prototype.bindEvents = function() {
  this.modalFrame.bindEvents(this);
  this.modalOverlay.bindEvents(this);
  this.modalContainer.bindEvents(this);
  if (this.escClose) {
    this.escapable();
  }
  // trap events (including ESC key)
  if (this.options.escClose) this.on('escape', this.close.bind(this));
  var self = this;
  this.on('close', function() {
    self.close();
  });
  return this;
};

LiteModal.prototype.close = function() {
  var self = this;
  $(document).unbind('keydown.LiteModal');
  this.hiding = true;
  this.modalContainer.close();
  this.modalOverlay.close();
  this.modalFrame.close();
  var onClose = this.options.onClose;
  if ($.isFunction(onClose)) {
    var element = this.modalData;
    onClose.apply(this, [element]);
  }
};

/**
 * Close the dialog when the escape key is pressed.
 *
 * @api private
 */
LiteModal.prototype.escapable = function(){
  var self = this;
  $(document).bind('keydown.LiteModal', function(e){
    if (27 !== e.which) return;
    self.emit('escape');
  });
};

// Expose the dialog
module.exports = LiteModal;

