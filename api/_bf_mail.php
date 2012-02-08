<?php
/*
    Document   : _bf_mail.php
    Created on : 29-Jan-2011, 22:02:22
    Author     : Paul Whitrow
    Description: All email functions...
*/
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

function mailTest()
{
    $headers = emailHeader();
    $headers.="From: paul@pwhitrow.com\r\n";
    $headers.="Reply-To: paul@pwhitrow.com\r\n";
    $headers.="Bcc: paul@pwhitrow.com\r\n";
    if($mail = mail("noreplay@pwhitrow.com", "test email", "This is a test!", $headers))
    {
        logger("Mail sent");
    }
    else
    {
        logger("Mail falied");
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
