<?php

include('libraries/phpmailer/class.phpmailer.php');


$mail = new PHPMailer();  // create a new object
$mail->IsSMTP(); // enable SMTP

// Change these
//$mail->SetFrom('mr.matt.ayers@gmail.com');
$mail->From = 'mr.matt.ayers@gmail.com';
$mail->Subject = 'Subject';
$mail->Body = 'Hello this is a test to matt';
$mail->AddAddress('mr.matt.ayres@gmail.com'); 

// GMail account details (add your own in here:)
$mail->Username = ''; // eg. 'mr.matt.ayers@gmail.com';  
$mail->Password = ''; 

$mail->SMTPDebug = 0;  // debugging: 1 = errors and messages, 2 = messages only
$mail->SMTPAuth = true;  // authentication enabled
$mail->SMTPSecure = 'ssl'; // secure transfer enabled REQUIRED for GMail
$mail->Host = 'smtp.gmail.com';
$mail->Port = 465; 



if(!$mail->Send()) {
       echo 'Mail error: '.$mail->ErrorInfo; 
        return false;
} else {
        echo 'Message sent!';
        return true;
}
?>
