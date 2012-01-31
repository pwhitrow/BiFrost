<?php
/*
    Document   : _bf_mail.php
    Created on : 29-Jan-2011, 22:02:22
    Author     : Paul Whitrow
    Description: All email functions...
*/
function emailHeader()
{
    $headers="MIME-Version: 1.0\r\n".
            "Content-Type: text/html; charset=utf-8\r\n" .
            "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $headers.="From: ".$_SESSION['org']['replyto'].PHP_EOL;
    $headers.="Reply-To: ".$_SESSION['org']['replyto'].PHP_EOL;
    
    return $headers;
}

function emailFooter()
{
    $footer = PHP_EOL.t("To unsubscribe from these emails please login to your control panel at") . " " .$_SESSION['org']['url'];
    
    return $footer;
}

function registerEmail($email)
{    
    $headers = emailHeader();
    $headers.="Bcc: ".$email.PHP_EOL;
    
    $mailstr = t("Hi, please click on the link below (or copy and paste it into your browser window) to complete the registration process.").PHP_EOL.PHP_EOL.$_SESSION['org']['url']."?verify=".$email.PHP_EOL;

    if(@mail($blank_email, stripslashes($_SESSION['org']['name']." : ".t("Registration")), wordwrap(stripslashes($mailstr),70), $headers))
    {
        $type = "success";
    }
    else
    {
        $type = "failure";
    }
}

function notifyUsersReviews($emails)
{    
    $headers = emailHeader();
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
