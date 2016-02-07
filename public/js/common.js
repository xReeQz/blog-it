require('../../node_modules/bootstrap/dist/css/bootstrap.css');
require('../../node_modules/font-awesome/css/font-awesome.css')
require('../less/app.less');

require('../../node_modules/jquery/dist/jquery.js');
require('../../node_modules/jquery-validation/dist/jquery.validate.js');
require('../../node_modules/bootstrap/dist/js/bootstrap.js');
require('../external/clean-blog/js/clean-blog.js');

$(function () {
	var profilePanel = $('.profile-panel');

	$('input', '.floating-label-form-group').each(function () {
		$(this).parent().toggleClass('floating-label-form-group-with-value', !!$(this).val());
	});

	$('body')
		.on('click', '#myProfile', function () {
			profilePanel.addClass('open');
		})
		.on('click', '#deleteProfile', function () {
			if (confirm('Do you really want to leave us?')) {
				var csrf = $('#csrf');
				$('<form />')
					.attr('method', 'POST')
					.attr('action', '/profile/delete')
					.append(csrf)
					.appendTo($('body'))
					.submit();
			}
		})
		.on('click', '.overlay, .profile-panel .close', function () {
			profilePanel.removeClass('open');
		});
});

$.validator.setDefaults({
	errorElement: 'span',
	errorPlacement: function (error, element) {
		$(element).siblings('.help-block').append(error);
	},
	highlight: function (element, errorClass) {
		$(element).parent('.form-group').addClass(errorClass);
	},
	unhighlight: function (element, errorClass) {
		$(element).parent('.form-group').removeClass(errorClass);
	}
});
