#!/usr/bin/perl 

# Revankar, Akash
# jadrn035
# Project #1
# Spring 2018

use CGI;   
use DBI;
use File::Basename;

my $host = "opatija.sdsu.edu";
my $port = "3306";
my $database = "jadrn035";
my $username = "jadrn035";
my $password = "file";
my $database_source = "dbi:mysql:$database:$host:$port";

	
my $dbh = DBI->connect($database_source, $username, $password) 
or die 'Cannot connect to db';


my $q = new CGI;
my $sku = $q->param('sku');
my $category = $q->param('category');
my $vendor = $q->param('vendor');
my $mfgid = $q->param('mfg-id');
my $description = $q->param('description');
my $features = $q->param('features');
my $cost = $q->param('cost');
my $retail = $q->param('retail');
my $qty = $q->param('qty');
my $image = $q->param('product-image');

my $extension = substr($image, index($image, "."));
if($extension) {
	$image = $sku.$extension;
}
else {
	my $sth = $dbh->prepare("SELECT image FROM products where sku='$sku'");
	my $str = "";
	$sth->execute();
	while(my @row=$sth->fetchrow_array()) {
	    foreach $item (@row) { 
	        $str .= $item;
	    }  
	}
	$sth->finish();
	
	$image = $str;
}

my $sth = $dbh->prepare("UPDATE products SET sku='".$sku."', category='".$category."', vendor='".$vendor."', mfg_id='".$mfgid."', description='"
                        .$description."', features='".$features."', cost='".$cost."', retail='".$retail."', quantity='".$qty."', image='".$image
                        ."' WHERE sku='".$sku."';");
$sth->execute();
$sth->finish();
$dbh->disconnect();

print "Content-type: text/html\n\n";  	
print "EDITED";