<?php

include('libs/phpmailer/class.phpmailer.php');


$mail = new PHPMailer();  // create a new object
$mail->IsSMTP(); // enable SMTP

// Change these
//$mail->SetFrom('mr.matt.ayers@gmail.com');
$mail->From = 'pcwhitrow@gmail.com';
$mail->Subject = 'Subject';
$mail->Body = 'Hello this is a test to Paul';
$mail->AddAddress('paul@pwhitrow.com'); 

// GMail account details (add your own in here:)
$mail->Username = 'pcwhitrow@gmail.com'; // eg. 'mr.matt.ayers@gmail.com';  
$mail->Password = 'ghhm9ab7'; 

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
