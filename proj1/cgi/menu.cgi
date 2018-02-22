use CGI;
use CGI::Session;
use CGI::Carp qw (fatalsToBrowser);
use Crypt::Password;


$q = new CGI;
$sid = $q->cookie('jadrn035_SID');

if($sid) {
  grant_access();
}
else {
  deny_access();
}


sub deny_access {
  print <<END;
Content-type: text/html

<html>
<head>
    <meta http-equiv="refresh" content="0; url=http://jadran.sdsu.edu/~jadrn035/proj1/access_denied.html" />
</head>
<body>
</body>
</html>
END
}  
    

sub grant_access {
print <<END;
Content-type: text/html

<!DOCTYPE html>
<html>
  <head>
  	<meta charset="utf-8">
  	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <title>Menu - Movieland</title>

  	<link rel="icon" href="/~jadrn035/proj1/favicon.png">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
                      integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
                      crossorigin="anonymous">
		<link href="/~jadrn035/proj1/css/style.css" rel="stylesheet">
		
		<script type="text/javascript" src="/jquery/jquery.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
            integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
            crossorigin="anonymous"></script>
		<script type="text/javascript" src="/~jadrn035/proj1/script/script.js"></script>
  </head>

  <body class="text-center">
    <header class="bg-dark">
      <h1>Movieland</h1>
    </header>
        
	<!-- Navigation Bar -->
    <div class="container">
      <ul id="options-nav-bar" class="nav nav-tabs nav-fill">
        <li class="nav-item">
          <a id="new-record-link" class="nav-link active" href="#">New Record</a>
        </li>
        <li class="nav-item">
          <a id="edit-record-link" class="nav-link" href="#">Edit Record</a>
        </li>
        <li class="nav-item">
          <a id="delete-record-link" class="nav-link" href="#">Delete Record</a>
        </li>
        <li class="nav-item">
          <a id="log-out-link" class="nav-link" data-toggle="modal" data-target="#modal-log-out" href="#">Log Out</a>
        </li>
      </ul>
	  
	  <!-- Log Out Modal -->
	  <div class="modal fade" id="modal-log-out" tabindex="-1" role="dialog" aria-hidden="true">
	    <div class="modal-dialog" role="document">
	      <div class="modal-content">
	        <div class="modal-header">
	          <h5 class="modal-title">Log Out</h5>
	          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
	            <span aria-hidden="true">&times;</span>
	          </button>
	        </div>
	        <div class="modal-body">
	          Are you sure you want to log out?
	        </div>
	        <div class="modal-footer">
	          <a href="#" class="btn btn-danger" data-dismiss="modal">No</a>
	          <a href="logout.cgi" class="btn btn-success">Yes</a>
	        </div>
	      </div>
	    </div>
	  </div>
	  
	  <!-- Confirmation Modal -->
	  <div class="modal fade" id="modal-confirmation" tabindex="-1" role="dialog" aria-hidden="true">
	    <div class="modal-dialog" role="document">
	      <div class="modal-content">
	        <div class="modal-header">
	          <h5 class="modal-title">Confirmation</h5>
	          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
	            <span aria-hidden="true">&times;</span>
	          </button>
	        </div>
	        <div id="modal-confirmation-body" class="modal-body">
			</div>
	        <div class="modal-footer justify-content-center">
	          <a href="#" class="btn btn-primary" data-dismiss="modal">Dismiss</a>
	        </div>
	      </div>
	    </div>
	  </div>
      
	  <!-- Form Container -->
      <div id="record-form-container" class="card">
        <div class="card-body">
          <h2 id="caption">Enter details of the new record.</h2>
        
          <form id="form-record" class="align-left" name="form-record" action="" method="post" enctype="mulitpart/form-data">
		  
	        <div id="product-display-image-container" class="mx-auto mb-3">
	          <img id="product-display-image" src="/~jadrn035/proj1/images/default-product.png" alt="Product Image" width="150px" height="auto" />
		  	</div>
			
            <!-- Product Image Upload -->
            <div class="input-group">
              <div class="custom-file">
                <input type="file" class="custom-file-input" name="product-image" id="product-image" required>
                <label class="custom-file-label" for="product-image">Choose Product Image</label>
              </div>
            </div>
            <div class="errors">
              <span id="error-image"></span>
            </div>
            
            <!-- SKU, Category -->
            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="sku">SKU</label>
                <input type="text" class="form-control" name="sku" id="sku" placeholder="Eg. ABC-123" maxlength="7" required>
                <div class="errors">
                  <span id="error-sku"></span>
                </div>
              </div>
              <div class="form-group col-md-6">
                <label for="category">Category</label>
                <select class="form-control" name="category" id="category" required>
                      <option value="- Select -" selected>- Select -</option>
                      <option value="Sci-Fi">Sci-Fi</option>
                      <option value="Drama">Drama</option>
                      <option value="Cult">Cult</option>
                      <option value="Superhero">Superhero</option>
                      <option value="Musical">Musical</option>
                </select>
                <div class="errors">
                  <span id="error-category"></span>
                </div>
              </div>
            </div>
            
            <!-- Vendor, Manufacturer&apos;s Identifier -->
            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="vendor">Vendor</label>
                <select class="form-control" name="vendor" id="vendor" required>
	                <option value="- Select -" selected>- Select -</option>
	                <option value="Warner Bros.">Warner Bros.</option>
	                <option value="Disney">Disney</option>
	                <option value="Miramax">Miramax</option>
	                <option value="Sony">Sony</option>
	                <option value="20th Century Fox">20th Century Fox</option>
                </select>
                <div class="errors">
                  <span id="error-vendor"></span>
                </div>
              </div>
              <div class="form-group col-md-6">
                <label for="mfg-id">Manufacturer&apos;s Identifier</label>
                <input type="text" class="form-control" name="mfg-id" id="mfg-id" placeholder="" maxlength="20" required>
                <div class="errors">
                  <span id="error-mfg-id"></span>
                </div>
              </div>
            </div>
            
            <!-- Description -->
            <div class="form-group">
              <label for="description">Description</label>
              <textarea id="description" class="form-control" name="description" rows="2" maxlength="300" required></textarea>
              <div class="errors">
                <span id="error-description"></span>
              </div>
			  <div id="desc-char-count" class="align-right">Character limit: 300</div>
            </div>
            
            <!-- Features -->
            <div class="form-group">
              <label for="features">Features</label>
              <textarea id="features" class="form-control" name="features" rows="5" maxlength="700" required></textarea>
              <div class="errors">
                <span id="error-features"></span>
              </div>
			  <div id="feat-char-count" class="align-right">Character limit: 700</div>
            </div>
            
            <!-- Cost, Retail, Quantity -->
            <div class="form-row">
              <div class="form-group col-md-4">
                <label for="cost">Cost</label>
                <input type="number" class="form-control" name="cost" id="cost" min="0.1" required>
                <div class="errors">
                  <span id="error-cost"></span>
                </div>
              </div>
              
              <div class="form-group col-md-4">
                <label for="retail">Retail</label>
                &dollar; <input type="number" class="form-control" name="retail" id="retail" min="0.1" required>
                <div class="errors">
                  <span id="error-retail"></span>
                </div>
              </div>
              
              <div class="form-group col-md-4">
                <label for="qty">Quantity</label>
                <input type="number" class="form-control" name="qty" id="qty" min="0" required>
                <div class="errors">
                  <span id="error-qty"></span>
                </div>
              </div>
            </div>
            
            <!-- Clear, Add buttons -->
      			<div class="record-buttons">
      				<button id="clear" class="btn btn-warning" type="reset" form="form-record">Clear</button>
      				<button id="submit" class="btn btn-success" type="submit" form="form-record">Add</button>
      			</div>
          </form>
        </div>
      </div>
      
      <p class="mt-5 text-muted">Movieland &copy; 2018-2019</p>
      
    </div>
    
  </body>
</html>

END
}    




