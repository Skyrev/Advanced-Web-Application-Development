# Revankar, Akash
# Account: jadrn035
# CS645 Spring 2018
# Project #1

use CGI;
use DBI;
use CGI::Session;

my $q = new CGI;
my $sku = $q->param('sku');
my $param_sid = $q->cookie('jadrn035_SID');
my $session = new CGI::Session(undef, $param_sid, {Directory=>'/tmp'});
my $sid = $session->id;

if($param_sid eq $sid) {
	my $host = 'opatija.sdsu.edu';
	my $port = '3306';
	my $database = 'jadrn035';
	my $username = 'jadrn035';
	my $password = 'file';

	my $database_source = "dbi:mysql:$database:$host:$port";
	my $dbh = DBI->connect($database_source, $username, $password)
		or die "Cannot connect to DB";
	
	my $sth = $dbh->prepare("SELECT sku FROM products where sku='$sku'");
	$sth->execute();
	my $number_of_rows = $sth->rows;
	$sth->finish();
	$dbh->disconnect();
	print "content-type: text/html\n\n";
	if($number_of_rows == 0) {
		print "UNIQUE";
	}
	else {
		print "DUPLICATE";
	}
}
else {
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