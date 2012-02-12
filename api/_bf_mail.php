<?php
/*
    Document   : _bf_mail.php
    Created on : 29-Jan-2011, 22:02:22
    Author     : Paul Whitrow
    Description: All email functions...
*/
include('libs/phpmailer/class.phpmailer.php');

$mail = new PHPMailer();  // create a new object
$mail->IsSMTP(); // enable SMTP

// GMail account details (add your own in here:)
$mail->Username = 'pcwhitrow@gmail.com'; // eg. 'mr.matt.ayers@gmail.com';  
$mail->Password = 'ghhm9ab7'; 

$mail->SMTPDebug = 0;  // debugging: 1 = errors and messages, 2 = messages only
$mail->SMTPAuth = true;  // authentication enabled
$mail->SMTPSecure = 'ssl'; // secure transfer enabled REQUIRED for GMail
$mail->Host = 'smtp.gmail.com';
$mail->Port = 465; 


function emailFooter()
{
    $footer = PHP_EOL.t("To unsubscribe from these emails please login to your dashboard panel at") . " " .$_SESSION['org']['url']. " " . t("and click on the watching tab.").PHP_EOL.PHP_EOL.PHP_EOL.t("Powered by")." ".APP_NAME;
    
    return $footer;
}


function _registerEmail($email)
{    
    global $mail;
    
    $org = getOrgDetails($_REQUEST["api_key"]);
    
    $mail->From = $org['replyto'];
    $mail->FromName = $org['name'];
    $mail->Subject = t("Registration");
    
    $mail->Body = t("Hi, please click on the link below (or copy and paste it into your browser window) to complete the registration process.").PHP_EOL.PHP_EOL.$org['url']."?verify=".$email.PHP_EOL.emailFooter();
    $mail->AddBCC($email); 

    if(!$mail->Send()) 
    {
        setErrorMsg(t("Oops! Mail fail!"). " : " .$mail->ErrorInfo);
        return false;
    } 
    else 
    {
        setSuccessMsg(t('Thank you for registering'));
        return true;
    }
}

function notifyUsersReviews($emails)
{    
    global $mail;

    $mail->From = $_SESSION['org']['replyto'];
    $mail->FromName = $_SESSION['org']['name'];
    $mail->Subject = t("New Review Notice");
    
    $mail->Body = t("Hi,".PHP_EOL.PHP_EOL."This is a quick notice to let you know there is a new review at ").$_SESSION['org']['url'].PHP_EOL.emailFooter();
    
    foreach($emails as $email)
    {
        $mail->AddBCC($email);
    }
    
    if(!$mail->Send()) 
    {
        $type = "failure";
        return false;
    } 
    else 
    {
        $type = "success";
        return true;
    }
}

function notifyUsersDiscussions($emails)
{    
    global $mail;
    
    $mail->From = $_SESSION['org']['replyto'];
    $mail->FromName = $_SESSION['org']['name'];
    $mail->Subject = t("New Discussion Notice");
    
    $mail->Body = t("Hi,".PHP_EOL.PHP_EOL."This is a quick notice to let you know there is a new discussion at ").$_SESSION['org']['url'].PHP_EOL.emailFooter();
    
    foreach($emails as $email)
    {
        $mail->AddBCC($email);
    }
    
    if(!$mail->Send()) 
    {
        $type = "failure";
        return false;
    } 
    else 
    {
        $type = "success";
        return true;
    }
}


?>
