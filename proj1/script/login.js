/*
	Revankar, Akash
	Account: jadrn035
	CS645 Spring 2018
	Project #1
*/

function clear() {
	$('#login-failed-msg').text('');
	$('#login-failed-msg').removeClass('visible');
	$('#login-failed-msg').addClass('hidden');
}

$(document).ready(function() {
	
	clear();
	
	$('input').on('focus', function() {
		clear();
	});
	
	$('#login-submit').on('click', function(e) {
		e.preventDefault();
		var form_data = new FormData($('form')[0]);
	    $.ajax({
	        url: "/perl/jadrn035/proj1/authenticate.cgi",
	        type: "post",
	        data: form_data,
	        processData: false,
	        contentType: false,
	        success: function(response) {
				if(response == 1) {
					window.location = "http://jadran.sdsu.edu/perl/jadrn035/proj1/menu.cgi";
				}
				else if(response == 0) {
					$('#login-failed-msg').text('Invalid Username/Password!');
					$('#login-failed-msg').removeClass('hidden');
					$('#login-failed-msg').addClass('visible');
				}
           
		  	},
	        error: function(response) {
				//
	        }
	    });
	});
	
	$('#login-clear').on('click', function() {
		clear();
	});
});