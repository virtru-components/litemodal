/*
 * LiteModal Basic Modal Dialog
 * Sample script:  A work-in-progress, not functional (RCG -- 20130625)
 *
 */

jQuery(function ($) {
	// Load dialog on page load
	//$('#basic-modal-content').modal();

//	// Load dialog on click
//	$('#basic-modal .basic').click(function (e) {
//		$('#basic-modal-content').modal();
//
//		return false;
//	});
  // Load dialog on click
  $('#basic-modal .basic').click(function (e) {
   var modal = this;
    console.log('opening dialog');
    console.log(modal);
    $('#basic-modal-content').modal({
      closeClass: "virtru-close",
      close: false,
//      onOpen: function(dialog) { form_onOpen(this, dialog); },
      onShow: function(dialog) { form_onShow(this, dialog); },
      onClose: function(dialog) { form_onClose(this, dialog); }
    });
    console.log("modal has opened!");

    return false;   // doesn't seem to matter whether true or false is returned
  });

});


function form_onOpen(modal, dialog) {
  console.log('on-open');
  // modal = the simplemodal object itself
//  dialog.overlay.fadeIn('slow', function() {
//    dialog.container.slideDown('slow', function() {
//      dialog.data.fadeIn('slow');
//    });
//  });
  dialog.overlay.fadeIn('slow');
  dialog.container.slideDown('slow');
  dialog.data.fadeIn('slow');
};

function form_onShow(modal, dialog) {
  console.log("on-show: dialog object");
  console.log(dialog);
  console.log('showing modal object');
  console.log(modal);
};

function form_onClose(modal, dialog) {
  console.log("on-close");
  console.log(dialog);
  // if 'onClose' event is used, then this must be called last.
  modal.close();
};

