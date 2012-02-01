<?php
/*
    Document   : _bf_mail.php
    Created on : 29-Jan-2011, 22:02:22
    Author     : Paul Whitrow
    Description: All email functions...
*/
require_once('./plugins/phpmailer/class.phpmailer.php');

function emailHeader()
{
    $headers="MIME-Version: 1.0\r\n";
    
    return $headers;
}

function emailFooter()
{
    $footer = PHP_EOL.t("To unsubscribe from these emails please login to your control panel at") . " " .$_SESSION['org']['url'];
    
    return $footer;
}

function registerEmail($email)
{
    $org              = getOrgDetails($_REQUEST["api_key"]);
    
    $mail             = new PHPMailer();

    $body             = t("Hi, please click on the link below (or copy and paste it into your browser window) to complete the registration process.").PHP_EOL.PHP_EOL.$org['url']."?verify=".$email.PHP_EOL;

    $mail->IsSMTP(); // telling the class to use SMTP
    $mail->Host       = "mail.pwhitrow.com"; // SMTP server
    $mail->SMTPDebug  = 2;                     // enables SMTP debug information (for testing)
                                               // 1 = errors and messages
                                               // 2 = messages only
    $mail->SMTPAuth   = true;                  // enable SMTP authentication
    $mail->SMTPSecure = "ssl";                 // sets the prefix to the servier
    $mail->Host       = "smtp.gmail.com";      // sets GMAIL as the SMTP server
    $mail->Port       = 465;                   // set the SMTP port for the GMAIL server
    $mail->Username   = "pcwhitrow@gmail.com";  // GMAIL username
    $mail->Password   = "ghhm9ab7";            // GMAIL password

    $mail->SetFrom($org['replyto'], $org['name']);

    $mail->AddReplyTo($org['replyto'], $org['name']);

    $mail->Subject    = $org['name']." : ".t("Registration");

    //$mail->AltBody    = "To view the message, please use an HTML compatible email viewer!"; // optional, comment out and test

    $mail->MsgHTML($body);

    $address = $email;

    if(!$mail->Send()) 
    {
        setSuccessMsg(t('Thank you for registering'));
    }
    else
    {
        setErrorMsg(t("Oops! Mail fail!"));
    }    
}


function _registerEmail($email)
{    
    $org = getOrgDetails($_REQUEST["api_key"]);
   
    $headers = "From: ".$org['replyto']."\r\n";
    $headers .= "Reply-To: ".$org['replyto']."\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    
    $mailstr = t("Hi, please click on the link below (or copy and paste it into your browser window) to complete the registration process.").PHP_EOL.PHP_EOL.$org['url']."?verify=".$email.PHP_EOL;

    if(mail($email, stripslashes($org['name']." : ".t("Registration")), wordwrap(stripslashes($mailstr),70), $headers))
    {
        setSuccessMsg(t('Thank you for registering'));
    }
    else
    {
        setErrorMsg(t("Oops! Mail fail!"));
    }
}

function notifyUsersReviews($emails)
{    
    $headers = emailHeader();
    $headers.="From: ".$_SESSION['org']['replyto']."\r\n";
    $headers.="Reply-To: ".$_SESSION['org']['replyto']."\r\n";
    $headers.="Bcc: ".implode(",", $emails).PHP_EOL;
    
    $mailstr = t("Hi, this is a quick notice to let you know there is a new review at ").$_SESSION['org']['url'].PHP_EOL.emailFooter();

    if(@mail($blank_email, stripslashes($_SESSION['org']['name']." : ".t("Notification of Review")), wordwrap(stripslashes($mailstr),70), $headers))
    {
        $type = "success";
    }
    else
    {
        $type = "failure";
    }
}

function notifyUsersDiscussions($emails)
{    
    $headers = emailHeader();
    $headers.="From: ".$_SESSION['org']['replyto']."\r\n";
    $headers.="Reply-To: ".$_SESSION['org']['replyto']."\r\n";
    $headers.="Bcc: ".implode(",", $emails).PHP_EOL;
    
    $mailstr = t("Hi, this is a quick notice to let you know there is a new discussion at ").$_SESSION['org']['url'].PHP_EOL.emailFooter();

    if(@mail($blank_email, stripslashes($_SESSION['org']['name']." : ".t("Notification of Discussion")), wordwrap(stripslashes($mailstr),70), $headers))
    {
        $type = "success";
    }
    else
    {
        $type = "failure";
    }
}


?>
