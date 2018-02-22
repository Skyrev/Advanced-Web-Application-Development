use CGI;
use CGI::Session;
use CGI::Carp qw (fatalsToBrowser);

my $q = new CGI;
my $sid = $q->cookie("jadrn035_SID") || undef;
$session = new CGI::Session(undef, $sid, {Directory => '/tmp'});
$session->delete();
my $cookie = $q->cookie(jadrn035_SID => '');
print $q->header( -cookie=>$cookie ); #send cookie with session ID to browser


print <<END;
Content-type: text/html

<html>
<head>
    <meta http-equiv="refresh" content="0; url=http://jadran.sdsu.edu/~jadrn035/proj1/logout.html" />
</head>
<body>
</body>
</html>
END