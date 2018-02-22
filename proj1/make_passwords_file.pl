#!/usr/bin/perl

#   This script creates a password text file in the current directory
#   with the filename 'passwords.dat'.  If the file exists, it will be
#   overwritten.  Hit ENTER when prompted for a username to terminate
#   the script.
#   This script encrypts the password using SHA-2 256.  You MUST use
#   the same salt in your login authentication script.  Use your own
#   value for the salt, not this one.
#   CS645, Spring 2018
#   Alan Riggins

use Crypt::Password;

my $salt = "6yTT7QR4";
my ($user, $password, $encrypted_password);

open OUTFILE, ">passwords.dat" or die "Cannot open file.";

print "Enter the username and password for each entry at the prompt.\n";
print "Hit ENTER for the username (leaving it empty) to end the script.\n\n";
for(;;) {
    print "Enter the username: ";
    $user = <STDIN>;
    chomp $user;
    if(length($user) == 0) { last; }
    print "Enter the password: ";
    $password = <STDIN>;
    chomp $password;
    $encrypted_password = Crypt::Password->new($password, $salt, sha256);
    print OUTFILE "$user" . "=" . $encrypted_password . "\n";
    } 
    
close OUTFILE;