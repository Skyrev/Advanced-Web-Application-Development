use CGI;
use CGI::Session;
use CGI::Carp qw (fatalsToBrowser);
use Crypt::Password;


$q = new CGI;
my $user = $q->param("username");
my $password = $q->param("password");    
open DATA, "</srv/www/cgi-bin/jadrn035/cgi/passwords.dat" 
    or die "Cannot open file.";
@file_lines = <DATA>;
close DATA;

$OK = 0; #not authorized

foreach $line (@file_lines) {
    chomp $line;
    ($stored_user, $stored_pass) = split (/=/, $line);    
    if($stored_user eq $user && check_password($stored_pass, $password)) {
        $OK = 1;
        last;
    }
}

if($OK) {
    my $session = new CGI::Session(undef, undef, {Directory=>'/tmp'});
    $session->expires('+1d');
    my $cookie = $q->cookie(jadrn035_SID => $session->id);
    print $q->header( -cookie=>$cookie ); #send cookie with session ID to browser
}
else {
	my $sid = $q->cookie("jadrn035_SID") || undef;
	$session = new CGI::Session(undef, $sid, {Directory => '/tmp'});
	$session->delete();
	my $cookie = $q->cookie(jadrn035_SID => '');
	print $q->header( -cookie=>$cookie ); #send cookie with session ID to browser
}

print $OK;