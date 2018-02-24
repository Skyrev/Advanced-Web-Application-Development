#!/usr/bin/perl 

# Revankar, Akash
# Account: jadrn035
# CS645 Spring 2018
# Project #1

use CGI;   
use DBI;


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

my $sth = $dbh->prepare("SELECT sku, category, vendor, mfg_id, description, features, cost, retail, quantity, image FROM products where sku='$sku'");
$sth->execute();

$str = "";
while(my @row=$sth->fetchrow_array()) {
    foreach $item (@row) { 
        $str .= $item."|";
    }       
    # $str .= ";";    
}

$sth->finish();
$dbh->disconnect();

print "Content-type: text/html\n\n";  	
print $str;