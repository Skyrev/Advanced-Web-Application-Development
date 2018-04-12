/*
	Revankar, Akash
	jadrn035
	Project #2
	Fall 2018

	products.js

	handles products page population and other behaviors of products page.
*/   


var proj2_data;
var filteredProducts;
var categoryData;
var vendorData;
   
// from http://www.webmasterworld.com/forum91/3262.htm            
function explodeArray(item,delimiter) {
	tempArray = new Array();
	var count = 0;
	var tempString = new String(item);

	while (tempString.indexOf(delimiter) > 0) {
		tempArray[count] = tempString.substr(0,tempString.indexOf(delimiter));
		tempString = tempString.substr(tempString.indexOf(delimiter) + 1, tempString.length-tempString.indexOf(delimiter) + 1);
		count = count + 1;
	}
	tempArray[count] = tempString;
	
	return tempArray;
}

// populate proj2_data
function loadProductsData(response) {
    var tmpArray = explodeArray(response,'^');
    for(var i=0; i < tmpArray.length; i++) {
        innerArray = explodeArray(tmpArray[i],'|');
        proj2_data[i] = innerArray;
    }
	setInterval(loadHomePageProducts, 10000);
	loadHomePageProducts();	
	loadProducts(false);
}

// populate filteredProducts
function loadFilteredProducts(response) {
	filteredProducts = new Array();
	if(response != "") {
	    var tmpArray = explodeArray(response,'^');
	    for(var i=0; i < tmpArray.length; i++) {
	        innerArray = explodeArray(tmpArray[i],'|');
	        filteredProducts[i] = innerArray;
	    }
		loadProducts(true);
	}
	else {
		$('.loading-modal').hide();
		$('#products-container').html('<h2 id="no-products">No products matching selected filters.<br>Clear filters to show all products.</h2>');
	}
}

// populate Home page products
function loadHomePageProducts() {
	var n = 3;
	var product = '';
	var r = Math.floor(Math.random() * (proj2_data.length - 1));
	random_product = [proj2_data[r], proj2_data[(r+3)%(proj2_data.length - 1)], proj2_data[(r+7)%(proj2_data.length - 1)]];
	
	for(var i=0; i<n; i++) {
		var availability = parseInt(random_product[i][8]) > 0 ? "In Stock" : "Coming Soon" ;
		product += '<div class="home-product"><img src="/~jadrn035/proj1/image_uploads/' + random_product[i][9] + '" alt="'+ random_product[i][3] +'" width="200px" height="auto" />';
		product += '<h3>'+ random_product[i][3] +'</h3>';
		product += '<p>Price: &dollar;'+ random_product[i][7] +'</p>';
		product += '<p>Availibilty: '+ availability +'</p>';
		product += '<button id="more-info" name="sku" value="'+ random_product[i][0] +'">More Info</button>';
		if(availability == "Coming Soon")
			product += '<button id="add-to-cart" name="sku" value="'+ random_product[i][0] +'" disabled>Add to Cart</button>';
		else
			product += '<button id="add-to-cart" name="sku" value="'+ random_product[i][0] +'">Add to Cart</button>';
		product += '</div>';
	}
	$('.home-products-container').html(product);
}

// populate Products page
function loadProducts(filtered) {
	
	var products = '<div class="product-list">';
	var data = filtered ? filteredProducts : proj2_data;
    for(var i=0; i < data.length; i++) {
		var availability = parseInt(data[i][8]) > 0 ? "In Stock" : "Coming Soon" ;
		products += '	<div class="product">';
		products += '		<img src="/~jadrn035/proj1/image_uploads/' + data[i][9] + '" alt="'+ data[i][3] +'" width="200px" height="auto" />';
		products += '		<h3>'+ data[i][3] +'</h3>';
		products += '		<p>Price: &dollar;'+ data[i][7] +'</p>';
		products += '		<p>Availability: '+ availability +'</p>';
		products += '		<button id="more-info" value="'+ data[i][0] +'">More Info</button>';
		if(availability == "Coming Soon")
			products += '		<button id="add-to-cart" value="'+ data[i][0] +'" disabled>Add to Cart</button>';
		else
			products += '		<button id="add-to-cart" value="'+ data[i][0] +'">Add to Cart</button>';
		products += '	</div>';
    }
	products += '</div>';
    $('#products-container').html(products);

	window.updateCart();
	
	$('.loading-modal').hide();
}

function loadCategory(response) {
    var tmpArray = explodeArray(response,'^');
    for(var i=0; i < tmpArray.length; i++) {
        innerArray = explodeArray(tmpArray[i],'|');
        categoryData[i] = innerArray;
    }
	var options = '<option value="">- Select -</option>';
	for(var i = 0; i < categoryData.length; i++)
		options += '<option value="' + categoryData[i][0] + '">' + categoryData[i][1] + '</option>';
	$('#filter-category').html(options);
}

function loadVendor(response) {
    var tmpArray = explodeArray(response,'^');
    for(var i=0; i < tmpArray.length; i++) {
        innerArray = explodeArray(tmpArray[i],'|');
        vendorData[i] = innerArray;
    }
	var options = '<option value="">- Select -</option>';
	for(var i = 0; i < vendorData.length; i++)
		options += '<option value="' + vendorData[i][0] + '">' + vendorData[i][1] + '</option>';
	$('#filter-vendor').html(options);
}


function constructProductInfoModal(sku) {
	var product = new Array();
	var html = "";
	for(var i = 0; i < proj2_data.length; i++) {
		if(sku == proj2_data[i][0]) {
			product = proj2_data[i];
			break;
		}
	}
	var availability = parseInt(product[8]) > 0 ? "In Stock" : "Coming Soon" ;
	var category = "";
	var vendor = "";
	
	for(var i = 0; i < categoryData.length; i++) {
		if(product[1] == categoryData[i][0]) {
			category = categoryData[i][1];
			break;
		}
	}
	
	for(var i = 0; i < vendorData.length; i++) {
		if(product[2] == vendorData[i][0]) {
			vendor = vendorData[i][1];
			break;
		}
	}
	
	html += '<div id="close-modal" class="align-right">&#10060;</div>';
	html +=	'<h2 class="align-center">' + product[3] + '</h2>';
	html += '<div class="product-info-contents">';
	html += '	<img src="/~jadrn035/proj1/image_uploads/' + product[9] + '" alt="' + product[3] + '" width="200px" height="auto" />';
	html += '	<table>';
	html += '		<tr>';
	html += '			<td>Description:</td>';
	html += '			<td>' + product[4] + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>Features:</td>';
	html += '			<td>' + product[5] + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>Category:</td>';
	html += '			<td>' + category + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>Vendor:</td>';
	html += '			<td>' + vendor + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>Price:</td>';
	html += '			<td>' + product[7] + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>Availability:</td>';
	html += '			<td>' + availability + '</td>';
	html += '		</tr>';
	html += '	</table>';
	html += '</div>';
	html += '<div class="product-info-buttons">';
	html += '	<button id="close-product-info">Close</button>';
	if(availability == "Coming Soon") {
		html += '	<button id="add-to-cart" value="' + product[0] + '" disabled>Add to Cart</button>';
		html += '	<button id="add-and-checkout" value="' + product[0] + '" disabled>Add and Checkout</button>';
	}
	else {
		html += '	<button id="add-to-cart" value="'+ product[0] + '">Add to Cart</button>';
		html += '	<button id="add-and-checkout" value="' + product[0] + '">Add and Checkout</button>';
	}
	html += '</div>';
	return html;
}

$(document).ready(function() {
	
	proj2_data = new Array();
	filteredProducts = new Array();
	categoryData = new Array();
	vendorData = new Array();
	
	$.get('/jadrn035/servlets/GetProducts', loadProductsData);
	
	$.get('/jadrn035/servlets/GetCategory', loadCategory);
	
	$.get('/jadrn035/servlets/GetVendor', loadVendor);
	
	$('.loading-modal').show();
	
	//from https://css-tricks.com/snippets/jquery/smooth-scrolling/
	$('a[href*="#"]').not('[href="#"]').not('[href="#0"]').click(function(event) {
		if(location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
		    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				event.preventDefault();
				$('html, body').animate({scrollTop: target.offset().top}, 300);
				return false;
			}
		}
	});
	
	$(document).on('click', '#more-info', function() {
		$('#product-info').html(constructProductInfoModal(this.value));
		$('.product-info-modal').show();
	});
	
	$(document).on('click', '.home-product img, .product img', function() {
		var sku = $(this).attr('src').split("/")[4].split(".")[0];
		$('#product-info').html(constructProductInfoModal(sku));
		$('.product-info-modal').show();
	});
	
	$(document).on('click', '#add-to-cart', function() {
		window.cart.add(this.value, 1);
		window.updateCart();
	});
	
	$(document).on('click', '#add-and-checkout', function() {
		window.cart.add(this.value, 1);
		updateCart();
		$('#close-modal').click();
		$('#cart-nav').click();
	});
	
	$(document).on('click', '#close-modal, #close-product-info', function() {
		$('#product-info').html('');
		$('.product-info-modal').hide();
	});
	
	$(document).on('click', '#filter-apply', function() {
		var description = $('#filter-description').val();
		var category = $('#filter-category option:selected').val();
		var vendor = $('#filter-vendor option:selected').val();
		var priceRange = $('#filter-price option:selected').val();
		var priceMin = '0';
		var priceMax = '9999';
		var availability = $('#filter-availability option:selected').val();
		
		if(description == '' && category == '' && vendor == '' && priceRange == '' && availability == '') {
			loadProducts(false);
			return;
		}
		
		if(priceRange.length != 0) {
			priceMin = priceRange.split('-')[0];
			priceMax = priceRange.split('-')[1];
		}
			
		var url = '/jadrn035/servlets/GetFilteredProducts?description='+ description +'&category='+ category
				+ '&vendor=' + vendor + '&priceMin=' + priceMin + '&priceMax=' + priceMax + '&availability=' + availability;
		$.get(url, loadFilteredProducts);
		$('#products-nav').click();
		$('.loading-modal').show();
	});
	
	$(document).on('click', '#filter-clear', function() {
		$('#filter-description').val('');
		$('#filter-category option:eq(0)').prop('selected', true);
		$('#filter-vendor option:eq(0)').prop('selected', true);
		$('#filter-price option:eq(0)').prop('selected', true);
		$('#filter-availability option:eq(0)').prop('selected', true);
		loadProducts(false);
		$('#products-nav').click();
	});
});