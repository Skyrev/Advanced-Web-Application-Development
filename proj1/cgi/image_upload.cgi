#   file upload script.  
#   Remember that you MUST use enctype="mulitpart/form-data"
#   in the web page that invokes this script, and the destination 
#   directory for the uploaded file must have permissions set to 777.  
#   Do NOT set 777 permission on any other directory in your account!
#   
#   CS645, Spring 2018
#   Alan Riggins

# Revankar, Akash
# Account: jadrn035
# CS645 Spring 2018
# Project #1

use CGI;
use CGI::Carp qw (fatalsToBrowser);
use File::Basename;

### constants
$CGI::POST_MAX = 1024 * 3000; # Limit file size to 3MB
my $upload_dir = '/home/jadrn035/public_html/proj1/image_uploads';
my $safe_filename_chars = "a-zA-Z0-9_.-";

my $q = new CGI;
my $sku = $q->param("sku");
my $filename = $q->param("product-image");
unless($filename) {
    die "There was a problem uploading the image. It's probably too big.";
}

my $extension = substr($filename, index($filename, "."));
$filename = $sku.$extension;

$filename =~ s/ //; #remove any spaces
if($filename !~ /^([$safe_filename_chars]+)$/) {
    die "Sorry, invalid character in the filename.";
}   

$filename = untaint($filename);

# get a handle on the uploaded image     
my $filehandle = $q->upload("product-image"); 

unless($filehandle) {
  die "Invalid handle";
}

# save the file
open UPLOADFILE, ">$upload_dir/$filename" or die "Error! Cannot save the file.";
binmode UPLOADFILE;
while(<$filehandle>) {
    print UPLOADFILE $_;
}
close UPLOADFILE;

print "content-type: text/html\n\n";
print "UPLOADED";

# this is needed because mod_perl runs with -T (taint mode), and thus the
# filename is insecure and disallowed unless untainted. Return values
# from a regular expression match are untainted.
sub untaint {
    if($filename =~ m/^(\w+)$/) {
      die "Tainted filename!";
    }
    return $1;
}