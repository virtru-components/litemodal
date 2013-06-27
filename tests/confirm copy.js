/*
 * SimpleModal Confirm Modal Dialog
 * http://simplemodal.com
 *
 * Copyright (c) 2013 Eric Martin - http://ericmmartin.com
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

jQuery(function ($) {
	$('#confirm-dialog input.confirm, #confirm-dialog a.confirm').click(function (e) {
		e.preventDefault();

		// example of calling the confirm function
		// you must use a callback function to perform the "yes" action
		confirm("Continue to the SimpleModal Project page?", function () {
			window.location.href = 'http://simplemodal.com';
		});
	});
});

function confirm(message, callback) {
        var self = this;
        console.log('confirm: opening');
        console.log(this);
        // thismodal = same as 'this' inside the onShow() callback. 
        // aka: modal window
	var thismodal = $('#confirm').modal({
//		closeHTML: "<a href='#' title='Close' class='modal-close'>x</a>",
		closeClass: "virtru-close",
		position: ["20%",],
		overlayId: 'confirm-overlay',
		containerId: 'confirm-container', 
//                onShow: function (dialog) { confirm_onShow(dialog); }
//                onShow: function (dialog) { self.onShow(dialog); }
		onShow: function (dialog) {
			var modal = this;
                        console.log('on-show: modal');
                        console.log(modal);
                        console.log('dialog');
                        console.log(dialog);

			$('.message', dialog.data[0]).append(message);

			// if the user clicks "yes"
			$('.yes', dialog.data[0]).click(function () {
				// call the callback
				if ($.isFunction(callback)) {
					callback.apply();
				}
				// close the dialog
				modal.close(); // or $.modal.close();
			});
		}
/** */
	});
console.log('confirm-called');
console.log(thismodal);
}

//confirm.prototype.onShow = function(dialog) {
confirm_onShow = function(dialog) {
  console.log('on-show...');
  console.log(this);
  console.log(dialog);
  var modal = this;
  $('.message', dialog.data[0]).append(message);
  
  // if the user clicks "yes"
  $('.yes', dialog.data[0]).click(function () {
    // call the callback
    if ($.isFunction(callback)) {
    callback.apply();
    }
    // close the dialog
    modal.close(); // or $.modal.close();
  });
};
