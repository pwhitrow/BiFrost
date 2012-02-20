<?php

/*
  Document   : _bf_login
  Created on : 20-Feb-2012, 00:15:20
  Author     : Paul Whitrow
  Description: Process main admin login
 */


require('./_bf_admin_include.php');

if($_REQUEST["action"] == "login")
{
    $prep = array();
    
    foreach ($_POST as $k => $v)
    {
        $prep[$k] = prepForDB($v);
    }
    
    $sql = "SELECT * FROM ".TABLEPRENAME."admins WHERE email='".$prep["username"]."' AND pass='".md5($prep["password"])."'";
echo $sql;
    $sql = mysql_fetch_array($sql);
    
    if(mysql_num_rows($sql) > 0)
    {
        $_SESSION["BIFROST_ADMIN"] = true;
        
        respond(
        array
        (
            "state" => "loggedin",
            "message" => "Welcome Admin",
            "apikey" => $apikey
        ));
    }
    else
    {
        $_SESSION["BIFROST_ADMIN"] = false;
        
        respond(
        array
        (
            "state" => "fail",
            "message" => "FAILED!... something went wrong :("
        ));

    }
}

?>

