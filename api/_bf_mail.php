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
$mail->Username = EMAILUSER; // eg. 'mr.matt.ayers@gmail.com';  
$mail->Password = EMAILPASS; 

$mail->SMTPDebug = 0;  // debugging: 1 = errors and messages, 2 = messages only
$mail->SMTPAuth = true;  // authentication enabled
$mail->SMTPSecure = 'ssl'; // secure transfer enabled REQUIRED for GMail
$mail->Host = 'smtp.gmail.com';
$mail->Port = 465; 

// include footer
function emailFooter($url)
{
    $footer = "";
    
    if(!empty($url))
    {
        $footer .= PHP_EOL.t("To unsubscribe from these emails please login to your dashboard panel at") . " " .$url. " " . t("and click on the watching tab.").PHP_EOL;
    }
    
    $footer .= PHP_EOL.PHP_EOL.t("Powered by")." ".APP_NAME;
    
    return $footer;
}


function registerEmail($prep, $userid)
{    
    global $mail;
    
    $email = $prep['email'];
    
    $org = getOrgDetails($_REQUEST["api_key"]);
    
    $mail->From = $org['replyto'];
    $mail->FromName = $org['name'];
    $mail->Subject = t("Verify Registration");
    
    $mail->Body = t("Hello")." ".$prep['gname'].",".PHP_EOL.PHP_EOL.t("You recently registered at")." ".$org['url'].". ".t("In order to complete that registration, please click on the link below (or copy and paste it into your browser window).").PHP_EOL.PHP_EOL.$org['url']."?verifynewsuser=".$userid;
    
    $mail->AddBCC($email); 

    if(!$mail->Send()) 
    {
        setErrorMsg(t("Oops!"). " : " .$mail->ErrorInfo);
        return false;
    } 
    else 
    {
        return true;
    }
}

function notifyUsersReviews($emails)
{    
    global $mail;

    $mail->From = $_SESSION['org']['replyto'];
    $mail->FromName = $_SESSION['org']['name'];
    $mail->Subject = t("New Review Notice");
    
    $mail->Body = t("Hi,".PHP_EOL.PHP_EOL."This is a quick notice to let you know there is a new review at ").$_SERVER["HTTP_REFERER"].PHP_EOL.emailFooter($_SERVER["HTTP_REFERER"]);
    
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
    
    $mail->Body = t("Hi,".PHP_EOL.PHP_EOL."This is a quick notice to let you know there is a new discussion at ").$_SERVER["HTTP_REFERER"].PHP_EOL.emailFooter($_SERVER["HTTP_REFERER"]);
    
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

function notifyUsersResetPassword($email, $newpass)
{    
    global $mail;
    
    $mail->From = $_SESSION['org']['replyto'];
    $mail->FromName = $_SESSION['org']['name'];
    $mail->Subject = t("Password Reset");
    
    $mail->Body = t("Hi,".PHP_EOL.PHP_EOL."This is a quick notice to let you know that your password has been reset to ").$newpass.PHP_EOL.PHP_EOL."You can log in at the site you were on, ".$_SERVER["HTTP_REFERER"]."and change your password to one of your chosing via the dashboard.".PHP_EOL.PHP_EOL.emailFooter();
    
    $mail->AddBCC($email);
    
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
