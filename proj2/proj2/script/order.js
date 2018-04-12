/*
	Revankar, Akash
	jadrn035
	Project #2
	Fall 2018

	order.js
	
	handles orders page behavior
*/

var cart = new shopping_cart("jadrn035");
var orderPlaced = false;
var showSummary = false;

function isEmpty(value) {
	return $.trim(value).length == 0;
}

function isValidState(state) {                                
	var stateList = new Array("AK","AL","AR","AZ","CA","CO","CT","DC",
        "DE","FL","GA","GU","HI","IA","ID","IL","IN","KS","KY","LA","MA",
        "MD","ME","MH","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ",
        "NM","NV","NY","OH","OK","OR","PA","PR","RI","SC","SD","TN","TX",
        "UT","VA","VT","WA","WI","WV","WY");
		
	for(var i=0; i < stateList.length; i++) 
    	if(stateList[i] == $.trim(state))
                return true;
    return false;
}

function isValidZip(value) {
	var regex = /^[1-9]{1}[0-9]{4}$/;
	return regex.test($.trim(value))
}

function isValidPhone(value) { 
	var regex = /^[0-9]{10}$/;
	return regex.test($.trim(value));
}

function isValidCard(value) { 
	var regex = /^[0-9]{16}$/;
	return regex.test($.trim(value));
}

function isValidExpirationDate(value) {
	var date = value.split('/'); 
    var month = date[0];
    var year = date[1];
    
    // now turn the three values into a Date object and check them
    var today = new Date();    
    var thisMonth = today.getMonth()+1;
    var thisYear = today.getFullYear();
    
    if((year > thisYear && month < 13) || (year == thisYear && month >= thisMonth) )
        return true;
    else
        return false;
}

function isValidSecurityCode(value) {
	var regex = /^[0-9]{3}$/;
	return regex.test($.trim(value));
}

function formHasNoErrors() {
	$('[name="firstname-billing"]').blur();
	$('[name="lastname-billing"]').blur();
	$('[name="addrline1-billing"]').blur();
	$('[name="addrline2-billing"]').blur();
	$('[name="city-billing"]').blur();
	$('[name="state-billing"]').blur();
	$('[name="zip-billing"]').blur();
	$('[name="phone-billing"]').blur();
	$('[name="firstname-shipping"]').blur();
	$('[name="lastname-shipping"]').blur();
	$('[name="addrline1-shipping"]').blur();
	$('[name="addrline2-shipping"]').blur();
	$('[name="city-shipping"]').blur();
	$('[name="state-shipping"]').blur();
	$('[name="zip-shipping"]').blur();
	$('[name="phone-shiping"]').blur();
	$('#payment-type').blur();
	$('[name="card-number"]').blur();
	$('[name="expr-date"]').blur();
	$('[name="security-code"]').blur();
	
	var errors = $('.errors span');
	for(i = 0; i < errors.length; i++)
		if ($(errors[i]).text().length != 0)
			return false;
	
	return true;
}

// clear all error messages
function clearErrors() {
	var errors = $('.errors span');
	for(i=0; i<errors.length; i++) {
		$(errors[i]).text("");
		$(errors[i]).removeClass('error-background');
	}
	if($('div.error-background').length != 0)
		$('div.error-background').remove();
}

function clearData() {
	var input = $('input');
	for(i = 0; i < input.length; i++) {
		$(input)[i].defaultValue = "";
	}
	$('#payment-type option:eq(0)').prop('selected', true);
}

function isCartEmpty() {
	return cart.size() == 0;
}

function clearCart() {
	var cartArray = cart.getCartArray();
	for(var i=0; i<cartArray.length; i++)
		cart.delete(cartArray[i][0]);
	orderPlaced = false;
}

function updateCart() {
	if(!isCartEmpty()) {
		var cartArray = cart.getCartArray();
		var cartSize = cart.size();
		var grossTotal = 0;
		var htmlCode = '';
		
		if(orderPlaced || showSummary) {
			htmlCode += '<div class="order-confirmation centered align-center">';
			
			if(showSummary && !orderPlaced) {
				htmlCode += '<h2>Order Summary</h2>';
				htmlCode += '<p>Order will be placed with card bearing number xxxx-xxxx-xxxx-'+ $('#card-number').val().slice(12) +'.<br/>';
			}
			else if(!showSummary && orderPlaced) {
				htmlCode += '<h2>Order Placed Successfully</h2>';
				htmlCode += 	'<p>Order successfully placed with card bearing number xxxx-xxxx-xxxx-'+ $('#card-number').val().slice(12) +'.<br/>';
			}
			
			htmlCode += 		'It&apos;ll be shipped to<br/>'+ $('[name="firstname-shipping"]').val() + ' ' + $('[name="lastname-shipping"]').val() + '<br/>';
			htmlCode += 		$('[name="addrline1-shipping"]').val() + '<br/>' + $('[name="addrline2-shipping"]').val() + '<br/>';
			htmlCode += 		$('[name="city-shipping"]').val() + ', ' + $('[name="state-shipping"]').val() + ', ' + $('[name="zip-shipping"]').val() + '</p>';
			
			
			if(!showSummary && orderPlaced) {
				htmlCode += 		'<a href="#products" id="continue-shopping" class="centered">Continue Shopping</a>';
			}
			htmlCode += '</div>';
		}
		else
			htmlCode += '<p class="align-center">Item(s) in Cart: ' + cartSize + '</p>';
		
		htmlCode += '<div class="tables centered">';
		htmlCode += 	'<table class="cart-items-table">';
		for(var i = 0; i < cartArray.length; i++) {
			var sku = cartArray[i][0];
			var qty = cartArray[i][1];
			var title = '';
			var image = '';
			var price = 0;
			var total = 0;
			for(var j = 0; j < window.proj2_data.length; j++) {
				if(sku == window.proj2_data[j][0]) {
					title = window.proj2_data[j][3];
					price = eval(window.proj2_data[j][7]);
					image = window.proj2_data[j][9];
					break;
				}
			}
			total = eval(qty*price);
			htmlCode += '<tr>';
			htmlCode += 	'<td class="cit-col1">';
			htmlCode += 		'<img src="/~jadrn035/proj1/image_uploads/'+ image +'" alt="'+ title +'" width="100px" height="auto" />';
			htmlCode += 	'</td>';
			htmlCode += 	'<td class="cit-col2">' + title + '<br/>';
			
			if(orderPlaced || showSummary) {
				htmlCode += 'Quantity: <input id="sku_' + sku + '" type="text" name="quantity" value="' + qty + '" size="5" maxlength="5" disabled />';
				htmlCode += '<span id="qtyerr_' + sku + '" class="quantity-errors"></span><br/>';
			}
			else {
				htmlCode += 'Quantity: <input id="sku_' + sku + '" type="text" name="quantity" value="' + qty + '" size="5" maxlength="5" />';
				htmlCode += '<span id="qtyerr_' + sku + '" class="quantity-errors"></span><br/>';
			}
			
			htmlCode += 'Price: $'+ price.toFixed(2) +'<br/>';
			htmlCode += 'Total: $' + total.toFixed(2);
			
			if(!(orderPlaced || showSummary))
				htmlCode += '<button class="remove-button" name="remove" value="'+ sku +'">Remove</button></td>';
		
			grossTotal += total;
		}
		htmlCode += '</table>';
		
		htmlCode += '<table class="billing-table">';
		htmlCode += 	'<tr>';
		htmlCode += 		'<td class="bt-col1 align-right">';
		htmlCode += 										'Items Total:<br/>';
		htmlCode += 										'Shipping Charges:<br/>';
		htmlCode += 										'Tax (@ 7.75%):<br/>';
		htmlCode += 										'Net Amount Payable:';
		htmlCode += 		'</td>';
		htmlCode += 		'<td class="bt-col2 align-right">';
		htmlCode += 										'$' + eval(grossTotal).toFixed(2) + '<br/>';
		htmlCode += 										'$5.00<br/>';
		htmlCode += 										'$' + eval(0.0775*(grossTotal + 5)).toFixed(2) + '<br/>';
		htmlCode += 										'$'+ eval(1.0775*(grossTotal + 5)).toFixed(2);
		htmlCode += 		'</td>';
		htmlCode += 	'</tr>';
		htmlCode += '</table>';
				
		if(!(orderPlaced || showSummary)) {
			htmlCode += '<div class="cart-empty-order-buttons centered">';
			htmlCode += 	'<button class="empty-cart-button" name="empty-cart" value="">Empty Cart</button>';
			htmlCode += 	'<button class="continue-order-button" name="continue-order" value="">Continue</button>';
			htmlCode += '</div>';
		}
		else if(showSummary) {
			htmlCode += '<div class="cart-empty-order-buttons centered">';
			htmlCode += 	'<button class="cancel-button" name="cancel-cart" value="">Cancel</button>';
			htmlCode += 	'<button class="place-order-button" name="place-order" value="">Place Order</button>';
			htmlCode += '</div>';
		}
		
		htmlCode += '</div>';
		
		$('.cart').html(htmlCode);
		
		$('.empty-cart-msg').hide();
		$('.cart').show();
		$('#cart-item-count').text(cartSize);
		$('#cart-nav').attr('title', cartSize + ' item(s) in cart');
	}
	else {
		$('.empty-cart-msg').show();
		$('.cart').hide();
		$('#cart-item-count').text('0');
		$('#cart-nav').attr('title', 'Your cart is empty!');
	}
}

function displayConfirmation(response) {
	$('.loading-modal').hide();
	orderPlaced = true;
	showSummary = false;
	updateCart();
	$('#cart-nav').click();
	$('#cart-item-count').text('0');
	clearCart();
}

function setQuantityIfInStock(response) {
	var params = response.split('|');
	if(parseInt(params[1]) >= parseInt(params[2])) {
		cart.setQuantity(params[0], params[2]);
		$('#qtyerr_' + params[0]).text('');
		updateCart();
	}
	else
		$('#qtyerr_' + params[0]).text('Only ' + params[1] + ' items in stock!');
}

$(document).ready(function() {	
	
	$(document).on('click', '[name="remove"]', function() {
		cart.delete(this.value);
		updateCart();
	});
	
	$(document).on('blur', '[name="quantity"]', function() {
		var sku = this.id.slice(4);
		var qty = this.value;
		if(isEmpty(qty))
			$('#qtyerr_' + sku).text('Cannot be empty!');
		else if(!$.isNumeric(qty))
			$('#qtyerr_' + sku).text('Should be a number!');
		else if(qty == 0) {
			$('#qtyerr_' + sku).text('Should be greater than zero!');
		}
		else
			$.get('/jadrn035/servlets/CheckStock?sku='+ sku +'&qty=' + qty, setQuantityIfInStock);
	});
	
	$(document).on('click', '.empty-cart-button', function() {
		clearCart();
		updateCart();
		$('#cart-nav').click();
	});
	
	$(document).on('click', '.continue-order-button', function() {
		var quantityErrors = $('.quantity-errors');
		for(var i = 0; i < quantityErrors.length; i++) {
			if(!isEmpty($(quantityErrors[i]).text())) {
				return;
			}
		}
		$('.place-order-form-modal').show();		
	});
	
	$('#close-modal, #cancel').on('click', function(e) {
		e.preventDefault();
		$('.place-order-form-modal').hide();
	});
	
	$('#summary').on('click', function(e) {
		e.preventDefault();
		if(formHasNoErrors()) {
			$('.place-order-form-modal').hide();
			showSummary = true;
			updateCart();
		}
	});
	
	$(document).on('click', '.cancel-button', function() {
		showSummary = false;
		orderPlaced = false;
		updateCart();
		$('#products-nav').click();
	});
	
	$(document).on('click', '.place-order-button', function() {
		$.get('/jadrn035/servlets/PlaceOrder', displayConfirmation);
		$('.loading-modal').show();
	});
	
	// handler for "Clear Form"
	$(':reset').on('click', function(){
		clearErrors();
		clearData();
	});
	
	$(document).on('click', '#continue-shopping', function() {
		clearCart();
		$.get('/jadrn035/servlets/GetProducts', window.loadProductsData);
	});
	
	// handler for "First Name"
	$('[name="firstname-billing"]').on('blur', function(){
		var value = $(this).val();
		
		if (isEmpty(value)) {	// Empty string check
			$('#firstname-billing-error').text("First Name cannot be empty.");
			$('#firstname-billing-error').addClass('error-background');
			
		}
		else {
			$('#firstname-billing-error').text("");
			$('#firstname-billing-error').removeClass('error-background');
			
		}
	});
	
	// handler for "Last Name"
	$('[name="lastname-billing"]').on('blur', function(){
		var value = $(this).val();
		
		if (isEmpty(value)) {	// Empty string check
			$('#lastname-billing-error').text("Last Name cannot be empty.");
			$('#lastname-billing-error').addClass('error-background');
			
		}
		else {
			$('#lastname-billing-error').text("");
			$('#lastname-billing-error').removeClass('error-background');
			
		}
	});
	
	// handler for "Address Line 1"
	$('[name="addrline1-billing"]').on('blur', function(){
		var value = $(this).val();
		
		if (isEmpty(value)) {	// Empty string check
			$('#addrline1-billing-error').text("Address Line 1 cannot be empty.");
			$('#addrline1-billing-error').addClass('error-background');
			
		}
		else {
			$('#addrline1-billing-error').text("");
			$('#addrline1-billing-error').removeClass('error-background');
			
		}
	});
	
	// handler for "Address Line 2"
	$('[name="addrline2-billing"]').on('blur', function(){
		var value = $(this).val();
		
		if(isEmpty(value)) {
			$(this).val("");
		}
	});
	
	// handler for "city"
	$('[name="city-billing"]').on('blur', function(){
		var value = $(this).val();
		
		if (isEmpty(value)) {	// Empty string check
			$('#city-billing-error').text("City cannot be empty.");
			$('#city-billing-error').addClass('error-background');
			
		}
		else {
			$('#city-billing-error').text("");
			$('#city-billing-error').removeClass('error-background');
			
		}
	});
	
	// handlers for "State"
	$('[name="state-billing"]').on('keyup', function(){
		$(this).val($(this).val().toUpperCase());
	});
	
	$('[name="state-billing"]').on('blur', function(){
		var value = $(this).val();
		
		if (isEmpty(value)) {	// Empty string and invalid characters check
			$('#state-billing-error').text("State cannot be empty.");
			$('#state-billing-error').addClass('error-background');
			
		}
		else if(!isValidState(value)) {
			$('#state-billing-error').text("Enter valid State (2-letters eg. CA).");
			$('#state-billing-error').addClass('error-background');
			
		}
		else {
			$('#state-billing-error').text("");
			$('#state-billing-error').removeClass('error-background');
			
		}
	});
	
	// handler for "Zip Code"
	$('[name="zip-billing"]').on('blur', function(){
		var value = $(this).val();
		
		if (isEmpty(value)) {	// Empty string and invalid characters check
			$('#zip-billing-error').text("Zip Code cannot be empty.");
			$('#zip-billing-error').addClass('error-background');
			
		}
		else if(!isValidZip(value)) {
			$('#zip-billing-error').text("Enter a valid 5-digit zip code.");
			$('#zip-billing-error').addClass('error-background');
			
		}
		else {
			$('#zip-billing-error').text("");
			$('#zip-billing-error').removeClass('error-background');
			
		}
	});
	
	// handler for "Phone"
	$('[name="phone-billing"]').on('blur', function(){
		var value = $(this).val();
		
		if (isEmpty(value)) {	// Empty string and invalid characters check
			$('#phone-billing-error').text("Phone number cannot be empty.");
			$('#phone-billing-error').addClass('error-background');
			
		}
		else if(!isValidPhone(value)) {
			$('#phone-billing-error').text("Enter a valid 10-digit phone number.");
			$('#phone-billing-error').addClass('error-background');
			
		}
		else {
			$('#phone-billing-error').text("");
			$('#phone-billing-error').removeClass('error-background');
			
		}
	});
	
	// handler for "First Name"
	$('[name="firstname-shipping"]').on('blur', function(){
		var value = $(this).val();
		
		if (isEmpty(value)) {	// Empty string check
			$('#firstname-shipping-error').text("First Name cannot be empty.");
			$('#firstname-shipping-error').addClass('error-background');
			
		}
		else {
			$('#firstname-shipping-error').text("");
			$('#firstname-shipping-error').removeClass('error-background');
			
		}
	});
	
	// handler for "Last Name"
	$('[name="lastname-shipping"]').on('blur', function(){
		var value = $(this).val();
		
		if (isEmpty(value)) {	// Empty string check
			$('#lastname-shipping-error').text("Last Name cannot be empty.");
			$('#lastname-shipping-error').addClass('error-background');
			
		}
		else {
			$('#lastname-shipping-error').text("");
			$('#lastname-shipping-error').removeClass('error-background');
			
		}
	});
	
	// handler for "Address Line 1"
	$('[name="addrline1-shipping"]').on('blur', function(){
		var value = $(this).val();
		
		if (isEmpty(value)) {	// Empty string check
			$('#addrline1-shipping-error').text("Address Line 1 cannot be empty.");
			$('#addrline1-shipping-error').addClass('error-background');
			
		}
		else {
			$('#addrline1-shipping-error').text("");
			$('#addrline1-shipping-error').removeClass('error-background');
			
		}
	});
	
	// handler for "Address Line 2"
	$('[name="addrline2-shipping"]').on('blur', function(){
		var value = $(this).val();
		
		if(isEmpty(value)) {
			$(this).val("");
		}
	});
	
	// handler for "city"
	$('[name="city-shipping"]').on('blur', function(){
		var value = $(this).val();
		
		if (isEmpty(value)) {	// Empty string check
			$('#city-shipping-error').text("City cannot be empty.");
			$('#city-shipping-error').addClass('error-background');
			
		}
		else {
			$('#city-shipping-error').text("");
			$('#city-shipping-error').removeClass('error-background');
			
		}
	});
	
	// handlers for "State"
	$('[name="state-shipping"]').on('keyup', function(){
		$(this).val($(this).val().toUpperCase());
	});
	
	$('[name="state-shipping"]').on('blur', function(){
		var value = $(this).val();
		
		if (isEmpty(value)) {	// Empty string and invalid characters check
			$('#state-shipping-error').text("State cannot be empty.");
			$('#state-shipping-error').addClass('error-background');
			
		}
		else if(!isValidState(value)) {
			$('#state-shipping-error').text("Enter valid State (2-letters eg. CA).");
			$('#state-shipping-error').addClass('error-background');
			
		}
		else {
			$('#state-shipping-error').text("");
			$('#state-shipping-error').removeClass('error-background');
			
		}
	});
	
	// handler for "Zip Code"
	$('[name="zip-shipping"]').on('blur', function(){
		var value = $(this).val();
		
		if (isEmpty(value)) {	// Empty string and invalid characters check
			$('#zip-shipping-error').text("Zip Code cannot be empty.");
			$('#zip-shipping-error').addClass('error-background');
			
		}
		else if(!isValidZip(value)) {
			$('#zip-shipping-error').text("Enter a valid 5-digit zip code.");
			$('#zip-shipping-error').addClass('error-background');
			
		}
		else {
			$('#zip-shipping-error').text("");
			$('#zip-shipping-error').removeClass('error-background');
			
		}
	});
	
	// handler for "Phone"
	$('[name="phone-shipping"]').on('blur', function(){
		var value = $(this).val();
		
		if (isEmpty(value)) {	// Empty string and invalid characters check
			$('#phone-shipping-error').text("Phone number cannot be empty.");
			$('#phone-shipping-error').addClass('error-background');
			
		}
		else if(!isValidPhone(value)) {
			$('#phone-shipping-error').text("Enter a valid 10-digit phone number.");
			$('#phone-shipping-error').addClass('error-background');
			
		}
		else {
			$('#phone-shipping-error').text("");
			$('#phone-shipping-error').removeClass('error-background');
			
		}
	});
	
	// handler for "Shipping address same as billing address"
	$('[name="same-addr"]').on('change', function() {
		if(this.checked) {
			$('[name="firstname-shipping"]').val($('[name="firstname-billing"]').val());
			$('[name="lastname-shipping"]').val($('[name="lastname-billing"]').val());
			$('[name="addrline1-shipping"]').val($('[name="addrline1-billing"]').val());
			$('[name="addrline2-shipping"]').val($('[name="addrline2-billing"]').val());
			$('[name="city-shipping"]').val($('[name="city-billing"]').val());
			$('[name="state-shipping"]').val($('[name="state-billing"]').val());
			$('[name="zip-shipping"]').val($('[name="zip-billing"]').val());
			$('[name="phone-shipping"]').val($('[name="phone-billing"]').val());
			
		}
		else {
			$('[name="firstname-shipping"]').val('');
			$('[name="lastname-shipping"]').val('');
			$('[name="addrline1-shipping"]').val('');
			$('[name="addrline2-shipping"]').val('');
			$('[name="city-shipping"]').val('');
			$('[name="state-shipping"]').val('');
			$('[name="zip-shipping"]').val('');
			$('[name="phone-shipping"]').val('');
			
		}
	});
	
	// handler for "Payment Type"
	$('#payment-type').on('change blur', function() {
		if($('#payment-type option:selected').val() == 'Unselected') {
			$('#payment-type-error').text("Select a valid payment type.");
			$('#payment-type-error').addClass('error-background');
			
		}
		else {
			$('#payment-type-error').text("");
			$('#payment-type-error').removeClass('error-background');
			
		}
	});
	
	// handler for "Card Number"
	$('[name="card-number"]').on('blur', function(){
		var value = $(this).val();
		
		if (isEmpty(value)) {	// Empty string and invalid characters check
			$('#card-number-error').text("Card number cannot be empty.");
			$('#card-number-error').addClass('error-background');
			
		}
		else if(!isValidCard(value)) {
			$('#card-number-error').text("Enter a valid 16-digit card number.");
			$('#card-number-error').addClass('error-background');
			
		}
		else {
			$('#card-number-error').text("");
			$('#card-number-error').removeClass('error-background');
			
		}
	});
	
	// handler for "Expiration Date"
	$('[name="expr-date"]').on('blur', function() {
		var value = $(this).val();
		
		if (isEmpty(value)) {	// Empty string and invalid characters check
			$('#expr-date-error').text("Expiration date cannot be empty.");
			$('#expr-date-error').addClass('error-background');
			
		}
		else if(!isValidExpirationDate(value)) {
			$('#expr-date-error').text("Enter a valid expiration date.");
			$('#expr-date-error').addClass('error-background');
			
		}
		else {
			$('#expr-date-error').text("");
			$('#expr-date-error').removeClass('error-background');
			
		}
	});
	
	// handler for "Security Code"
	$('[name="security-code"]').on('blur', function() {
		var value = $(this).val();
		
		if (isEmpty(value)) {	// Empty string and invalid characters check
			$('#security-code-error').text("Security Code cannot be empty.");
			$('#security-code-error').addClass('error-background');
			
		}
		else if(!isValidSecurityCode(value)) {
			$('#security-code-error').text("Enter a valid security code.");
			$('#security-code-error').addClass('error-background');
		}
		else {
			$('#security-code-error').text("");
			$('#security-code-error').removeClass('error-background');
			
		}
	});
	
});