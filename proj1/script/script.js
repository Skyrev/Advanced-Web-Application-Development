/*
	Revankar, Akash
	Account: jadrn035
	CS645 Spring 2018
	Project #1
*/

// Redirect to Access Denied page if session has expired
if(getCookie('jadrn035_SID') == '')
	window.location = "http://jadran.sdsu.edu/~jadrn035/proj1/access_denied.html";

// currentTab indicates the tab the user is currently in
var currentTab = 'Add';

// Parse a string separated by a specified delimiter
// and store its components in an array
// Source: http://www.webmasterworld.com/forum91/3262.htm
function explodeArray(item,delimiter) {
	var tempArray = new Array();
	var count = 0;
	var tempString = new String(item);

	while (tempString.indexOf(delimiter) > 0) {
		tempArray[count] = tempString.substr(0,tempString.indexOf(delimiter));
		tempString = tempString.substr(tempString.indexOf(delimiter) + 1,
										tempString.length-tempString.indexOf(delimiter) + 1);
		count = count + 1;
	}
	tempArray[count] = tempString;
	
	return tempArray;
}

// Returns true if the passed parameter is empty
function isEmpty(value) {
	return $.trim(value).length == 0;
}

// Returns true if the passed parameter has correct extension
function isValidFileFormat(name) {
	var length = name.length;
	var dot = name.lastIndexOf('.');
	var ext = name.slice(dot+1, dot+5 ).toLowerCase();
	if (ext == 'jpg' || ext == 'jpeg' || ext == 'png' || ext == 'gif'
					 || ext == 'tiff' || ext == 'svg' || ext == 'bmp') {
		return true;
	}
	return false;
}

// Returns true if the passed parameter is not 0 (- Select -)
function isValidOption(value) {
	return value != 0;
}

// Disables the submit (Add, Edit, Delete) button
function disableSubmit() {
	$('[type="submit"]').prop('disabled', 'disabled');
	$('[type="submit"]').prop('title', 'Fill all mandatory fields to submit');
}

// Enables the submit (Add, Edit, Delete) button if there are no errors
function enableSubmit() {
	var select_tags = $('select');
	var error_msgs = $('.errors span');
	var input_tags = $('input');
	var textarea_tags = $('textarea');
	
	for(i=0; i<select_tags.length; i++) {
		if (!isValidOption($(select_tags[i]).value)) {
			disableSubmit();
			return;
		}
	}
	
	for(i=0; i<error_msgs.length; i++) {
		if ($(error_msgs[i]).text().length != 0) {
			disableSubmit();
			return;
		}
	}
	for(i=0; i<input_tags.length; i++) {
		if (input_tags[i].name != 'product-image' && $(input_tags[i]).val().length == 0) {
			disableSubmit();
			return;
		}
		if (input_tags[i].name == 'product-image'
			&& $(input_tags[i])[0].labels[0].textContent == 'Choose Product Image') {
			disableSubmit();
			return;
		}
	}
	
	for(i=0; i<textarea_tags.length; i++) {
		if ($(textarea_tags[i]).val().length == 0) {
			disableSubmit();
			return;
		}
	}
	
	$('[type="submit"]').prop('disabled', false);
	$('[type="submit"]').prop('title', 'Click to submit form');
}

// Clears the error messages
function clearErrors() {
	var error_msgs = $('.errors span');
	for(i=0; i<error_msgs.length; i++) {
		$(error_msgs[i]).text('');
	}
}

// Clears data from input fields, selects the default dropdown option
// and changes any changed labels to its default values 
function clearData() {
	var input_tags = $('input');
	for(i=0; i<input_tags.length; i++) {
		$(input_tags)[i].value = '';
	}
	$('#product-display-image').prop('src', '/~jadrn035/proj1/images/default-product.png');
	$('textarea').val('');
	$('label[for="product-image"]').text('Choose Product Image');
	$('#category option:eq(0)').prop('selected', true);
	$('#vendor option:eq(0)').prop('selected', true);
	$('#desc-char-count').text('Character limit: 300');
	$('#feat-char-count').text('Character limit: 700');
	clearErrors();
	disableSubmit();
}

// Disables the input fields (Edit and Delete tabs) except that of SKU
function disableFieldsExceptSKU() {
	$('#category').prop('disabled', true);
	$('#vendor').prop('disabled', true);
	$('#mfg-id').prop('disabled', true);
	$('#description').prop('disabled', true);
	$('#features').prop('disabled', true);
	$('#cost').prop('disabled', true);
	$('#retail').prop('disabled', true);
	$('#qty').prop('disabled', true);
	$('#product-image').prop('disabled', true);
	$('.custom-file-label').css('background-color', '#e9ecef');
}

// Enables the input fields (Edit and Delete tabs)
function enableFields() {
	$('#category').prop('disabled', false);
	$('#vendor').prop('disabled', false);
	$('#mfg-id').prop('disabled', false);
	$('#description').prop('disabled', false);
	$('#features').prop('disabled', false);
	$('#cost').prop('disabled', false);
	$('#retail').prop('disabled', false);
	$('#qty').prop('disabled', false);
	$('#product-image').prop('disabled', false);
	$('.custom-file-label').css('background-color', '');
}

// Populate input fields (Edit and Delete tabs) with values received from the database
function populateFields(response) {
	if(response != '') {
		var record = explodeArray(response, '|');
		$('#category').val(record[1]);
		$('#vendor').val(record[2]);
		$('#mfg-id').val(record[3]);
		
		$('#description').val(record[4]);
		$('#desc-char-count').text(300 - record[4].length +' character(s) left');
		
		$('#features').val(record[5]);
		$('#feat-char-count').text(700 - record[5].length +' character(s) left');
		
		$('#cost').val(record[6]);
		$('#retail').val(record[7]);
		$('#qty').val(record[8]);
		$('label[for="product-image"]').text(record[9]);
		$('#product-display-image').prop('src', '/~jadrn035/proj1/image_uploads/' + record[9]);
		enableSubmit();
		
		if(currentTab == 'Edit') {
			enableFields();
		}
	}
	else {
		disableSubmit();
		disableFieldsExceptSKU();
	}
}

// Process the server response for the queried SKU
// If the SKU exists in the database, populate the form with
// values corresponding to the SKU
function process_response(response) {
	if(response == 'DUPLICATE') {
		$('#error-sku').text('');
		var param = "sku=" + $.trim($('#sku').val());
		var url = "/perl/jadrn035/proj1/get_record.cgi?" + param;
		$.get(url, populateFields);
	}
	else if(response == 'UNIQUE') {
		$('#error-sku').text('SKU does not exist in the database');
		disableSubmit();
		disableFieldsExceptSKU();
	}
	else {
		$('#error-sku').text('Server error. Try again after sometime');
		disableSubmit();
		disableFieldsExceptSKU();
	}
}

// Handler for duplicate SKU
function duplicate_handler(response) {
	if(response == 'DUPLICATE') {
		$('#error-sku').text('SKU already exists in the database');
		disableSubmit();
	}
	else if(response == 'UNIQUE') {
		$('#error-sku').text('');
	}
}

// Constructs the confirmation message to be displayed in the modal
function constructConfirmationMessage() {
	var name = $.trim($('#product-image')[0].labels[0].textContent);
	var dot = name.lastIndexOf('.');
	var ext = name.slice(dot+1, dot+4);
	
	var image = $('#sku').val() + '.' + ext;
	var sku = $('#sku').val();
	var category = $('#category option:eq('+ $('#category').val() +')').text();
	var vendor = $('#vendor option:eq('+ $('#vendor').val() +')').text();
	var mfg_id = $('#mfg-id').val();
	
	var description = $('#description').val();
	if(description.length > 100)
		description = description.substr(0,100) + '....';
	
	var features = $('#features').val();
	if(features.length > 100)
		features = features.substr(0,100) + '....';
	
	var cost = $('#cost').val();
	var retail = $('#retail').val();
	var qty = $('#qty').val();
	
	var html_code = '<table class="table"><div id="product-display-image-container" class="mx-auto mb-3">'
 					+ '<img id="modal-product-display-image" src="/~jadrn035/proj1/image_uploads/' + image
					+ '" alt="Product Image" width="100px" height="auto" /></div>'
					+ '<tbody><tr><td>SKU</td><td>'+ sku +'</td></tr><tr><td>Category</td><td>' + category + '</td></tr>'
					+ '<tr><td>Vendor</td><td>'+ vendor +'</td></tr><tr><td>Manufacturer&apos;s Identifier</td><td>' + mfg_id + '</td></tr>'
					+ '<tr><td>Description</td><td>'+ description +'</td></tr><tr><td>Features</td><td>' + features + '</td></tr>'
					+ '<tr><td>Cost</td><td>'+ cost +'</td></tr><tr><td>Retail</td><td>$' + retail + '</td></tr>'
					+ '<tr><td>Quantity</td><td>'+ qty +'</td></tr></tbody></table>';
	
	$('#modal-confirmation-body').html(html_code);
}

// Displays message after form submission
function displayConfirmation(response) {
	// Hide the processing gif
	$('[type="submit"]').html('');
	$('[type="submit"]').text(currentTab);
	
	if(response == 'ADDED' || response == 'EDITED' || response == 'DELETED') {
		if(response == 'ADDED') {
			$('#modal-confirmation .modal-title').text('Record added successfully!');		
		}
		else if(response == 'EDITED') {
			$('#modal-confirmation .modal-title').text('Record edited successfully!');	
		}
		else if(response == 'DELETED') {
			$('#modal-confirmation .modal-title').text('Record deleted successfully!');	
		}
		constructConfirmationMessage();
		$('#modal-confirmation').modal('show');
		$('[type="reset"]').click();
	}
	else {
		$('#modal-confirmation .modal-title').text('Error');
		$('#modal-confirmation-body').text('Some error occurred. Please try again after some time.');
		$('#modal-confirmation').modal('show');
	}
}

// Serializes form data
function getParams() {
	return $('form').serialize() + '&product-image='
			+ $.trim($('#product-image')[0].labels[0].textContent);
}

// Uploads image to the server
function upload_image(url) {
    var form_data = new FormData($('form')[0]);       
    form_data.append('image', document.getElementById('product-image').files[0]);         	
    
    $.ajax({
        url: '/perl/jadrn035/proj1/image_upload.cgi',
        type: 'post',
        data: form_data,
        processData: false,
        contentType: false,
        success: function(response) {
			if(response == 'UPLOADED') {
				$.get(url, displayConfirmation);
			}
           
	  	},
        error: function(response) {
			displayConfirmation('ERROR');
        }
    });
}

// Source: https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Source: http://jsbin.com/hiboxubaho/edit?html,js,output
function displayImage(value) {
    if (value && $('#product-image')[0].files && $('#product-image')[0].files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#product-display-image').prop('src', e.target.result);
        };

        reader.readAsDataURL($('#product-image')[0].files[0]);
    }
	else {
		$('#product-display-image').prop('src', '/~jadrn035/proj1/images/default-product.png');
	}
}


$(document).ready(function() {
	
	enableFields();
	$('#sku').focus();
	disableSubmit();
	
	// Handlers for loading form based on the option selected
	$('#new-record-link').on('click', function() {
		currentTab = 'Add';
		
		$(this).addClass('active');
		$('#edit-record-link').removeClass('active');
		$('#delete-record-link').removeClass('active');
		
		$('#caption').text('Enter details of the new record');
		
		clearData();
		$('#sku').focus();
		enableFields();
		$('[type="submit"]').text(currentTab);
		enableSubmit();
	});
	
	$('#edit-record-link').on('click', function() {
		currentTab = 'Edit';
		
		$(this).addClass('active');
		$('#new-record-link').removeClass('active');
		$('#delete-record-link').removeClass('active');
		
		$('#caption').text('Enter SKU of the record to be edited');
		
		clearData();
		$('#sku').focus();
		disableFieldsExceptSKU();
		$('[type="submit"]').text(currentTab);
		enableSubmit();
		
	});
	
	$('#delete-record-link').on('click', function() {
		currentTab = 'Delete';
		
		$(this).addClass('active');
		$('#edit-record-link').removeClass('active');
		$('#new-record-link').removeClass('active');
		
		$('#caption').text('Enter SKU of the record to be deleted');
		
		clearData();
		$('#sku').focus();
		disableFieldsExceptSKU();
		$('[type="submit"]').text(currentTab);
		enableSubmit();
	});
	
	// Handlers for SKU
	$('#sku').on('blur', function() {
		if(getCookie('jadrn035_SID') == '') {
			$('#modal-redirect-body').text('Looks like your session has expired. Log in again to continue.');
			$('#modal-redirect').modal('show');
		}
		var value = $(this).val();
		var param = "sku=" + $.trim(value);
		
		if (isEmpty(value)) {	// Empty string check
			$('#error-sku').text('SKU cannot be empty');
			disableSubmit();
		}
		else if(!value.match(/^[A-Z]{3}-[0-9]{3}$/)) {
			$('#error-sku').text('Enter a valid SKU format (Eg. BVS-316)');
			disableSubmit();
		}
		else if(currentTab == 'Add') {
			$('#error-sku').text('');
			enableSubmit();
			var url = "/perl/jadrn035/proj1/check_duplicate.cgi?" + param;
			$.get(url, duplicate_handler);
		}
		else {
			var url = "/perl/jadrn035/proj1/check_duplicate.cgi?" + param;
			$.get(url, process_response);
		}
	});
	
	$('#sku').on('keyup', function() {
		$(this).val($(this).val().toUpperCase());
	});
	
	// Handler for Category
	$('#category').on('blur change', function(){
		var value = $(this).val();
		
		if(!isValidOption(value)) {
			$('#error-category').text('Please select a category');
			disableSubmit();
		}
		else {
			$('#error-category').text('');
			enableSubmit();
		}
	});
	
	// Handler for Vendor
	$('#vendor').on('blur change', function() {
		var value = $(this).val();
		
		if (!isValidOption(value)) {
			$('#error-vendor').text('Please select a category');
			disableSubmit();
		}
		else {
			$('#error-vendor').text('');
			enableSubmit();
		}
	});
	
	// Handler for Manufacturer's Identifier
	$('#mfg-id').on('blur', function() {
		var value = $(this).val();
		
		if (isEmpty(value)) {	// Empty string check
			$('#error-mfg-id').text('Manufacturer\'s Identifier cannot be empty');
			disableSubmit();
		}
		else {
			$('#error-mfg-id').text('');
			enableSubmit();
		}
	});
	
	// Handlers for Description
	$('#description').on('blur', function() {
		var value = $(this).val();
		
		if (isEmpty(value)) {	// Empty string check
			$('#error-description').text('Description cannot be empty');
			disableSubmit();
		}
		else {
			$('#error-description').text('');
			enableSubmit();
		}
	});
	$('#description').on('keyup', function(){
		if($(this).val().length < 300) {
			var charCount = 300 - $(this).val().length;
			$('#desc-char-count').text(charCount + ' character(s) left');
		}
		else {
			$(this).val($(this).val().substr(0,300));
			$('#desc-char-count').text('0 character(s) left');
		}
	});
	
	// Handlers for Features
	$('#features').on('blur', function() {
		var value = $(this).val();
		
		if (isEmpty(value)) {	// Empty string check
			$('#error-features').text('Features cannot be empty');
			disableSubmit();
		}
		else {
			$('#error-features').text('');
			enableSubmit();
		}
	});
	$('#features').on('keyup', function(){
		if($(this).val().length < 700) {
			var charCount = 700 - $(this).val().length;
			$('#feat-char-count').text(charCount + ' character(s) left');
		}
		else {
			$(this).val($(this).val().substr(0,700));
			$('#feat-char-count').text('0 character(s) left');
		}
	});
	
	// Handler for Cost
	$('#cost').on('blur', function() {
		var value = $(this).val();
		
		if (isEmpty(value)) {	// Empty string check
			$('#error-cost').text('Cost cannot be empty');
			disableSubmit();
		}
		else if(isNaN(value) || value <= 0) {
			$('#error-cost').text('Cost should be a number greater than zero');
			disableSubmit();
		}
		else {
			$('#error-cost').text('');
			enableSubmit();
		}
	});
	
	// Handler for Retail
	$('#retail').on('blur', function() {
		var value = $(this).val();
		
		if (isEmpty(value)) {	// Empty string check
			$('#error-retail').text('Retail cannot be empty');
			disableSubmit();
		}
		else if(isNaN(value) || value <= 0) {
			$('#error-retail').text('Retail should be a number greater than zero');
			disableSubmit();
		}
		else {
			$('#error-retail').text('');
			enableSubmit();
		}
	});
	
	// Handler for Quantity
	$('#qty').on('blur', function() {
		var value = eval($(this).val());
		
		if (isEmpty(value)) {	// Empty string check
			$('#error-qty').text('Quantity cannot be empty');
			disableSubmit();
		}
		else if(!Number.isInteger(value) || value < 0) {
			$('#error-qty').text('Quantity should be an integer greater than or equal to zero');
			disableSubmit();
		}
		else {
			$('#error-qty').text('');
			enableSubmit();
		}
	});
	
	// Handler for Choose Product Image
	$('#product-image').on('blur change', function(){
		if (this.files[0] == null) {
			$('#error-image').text('Please upload product image');
			$('label[for="product-image"]').text('Choose Product Image');
			disableSubmit();
			displayImage(false);
		}
		else if (!isValidFileFormat(this.files[0].name)) {
			$('#error-image').text('Only .jpg, .jpeg, .png, .bmp, .svg, .gif, .tiff image formats are allowed. Upload another image');
			$('label[for="product-image"]').text('Choose Product Image');
			disableSubmit();
			displayImage(false);
		}
		else if (!this.files[0].name.match(/^[a-zA-Z0-9_.-]+$/)) {
			$('#error-image').text('File name contains invalid characters. Valid characters are letters, digits, dot, dash and underscore.');
			$('label[for="product-image"]').text('Choose Product Image');
			disableSubmit();
			displayImage(false);
		}
		else if (this.files[0].size/1000 > 3000) {
			$('#error-image').text('File size exceeds 3 MB. Upload a smaller image');
			$('label[for="product-image"]').text('Choose Product Image');
			disableSubmit();
			displayImage(false);
		}
		else {
			$('label[for="product-image"]').text(this.files[0].name);
			$('#error-image').text('');
			enableSubmit();
			displayImage(true);
		}
	});
	
	// Handler for Clear buttons
	$('[type="reset"]').on('click', function(e) {
		e.preventDefault();
		clearData();
		if(currentTab != 'Add') {
			disableFieldsExceptSKU()
		}
		$('#sku').focus();
		$(window).scrollTop();
	});
	
	
	// Handler for Add, Edit, Delete buttons
	$('[type="submit"]').on('click', function(e) {
		e.preventDefault();
		
		if(getCookie('jadrn035_SID') == '') {
			$('#modal-redirect-body').text('Looks like your session has expired. Log in again to continue.');
			$('#modal-redirect').modal('show');
		}
		
		var value = $(this).text();
		var url = '/perl/jadrn035/proj1/';
		$(this).html('<img src="/~jadrn035/proj1/images/processing.png" width="22px" height="auto"/>');
		if(value == 'Delete') {
			url += 'delete_record.cgi?sku=' + $.trim($('#sku').val());
			$.get(url, displayConfirmation);
		}
		else if(value == 'Add') {
			url += 'add_record.cgi?' + getParams();
			upload_image(url);
		}
		else if(value == 'Edit') {
			url += 'edit_record.cgi?' + getParams();
			if($('#product-image')[0].files.length == 0)
				$.get(url, displayConfirmation);
			else
				upload_image(url);
		}
	});
	
});

