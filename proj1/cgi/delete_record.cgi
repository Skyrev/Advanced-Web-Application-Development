#!/usr/bin/perl 

# Revankar, Akash
# jadrn035
# Project #1
# Spring 2018

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

my $sth = $dbh->prepare("DELETE FROM products WHERE sku=?;");
$sth->execute($sku);
$sth->finish();
$dbh->disconnect();

print "Content-type: text/html\n\n";  	
print "DELETED";