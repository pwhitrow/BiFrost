<?php
/*
  Document   : _bf_org_admin
  Created on : 11-Feb-2012, 23:06:55
  Author     : Paul Whitrow
  Description: Sign up new clients
 */

require('./_bf_admin_include.php');

if($_REQUEST["action"] == "signup")
{
    $prep = array();
    
    foreach ($_POST as $k => $v)
    {
        $prep[$k] = prepForDB($v);
    }
    
    $apikey = createAPIkey($prep["name"]);

    $str = mysql_query("SELECT id FROM ".TABLEPRENAME."organisations WHERE api_key = '".$apikey ."'");
    
    if(mysql_num_rows($str) <= 0)
    {
        $str = "INSERT INTO ".TABLEPRENAME."organisations (api_key, name, url, description, address, tel, email, replyto, admin_email, contact, reviews, discussions, watches, paginator, date_registered) VALUES('".$apikey ."','".$prep["name"]."','".$prep["url"]."','".$prep["description"]."','".$prep["address"]."','".$prep["tel"]."','".$prep["replytoemail"]."','".$prep["adminemail"]."','".$prep["contactname"]."','".$prep["contactemail"]."','".checked($prep["reviews"])."','".checked($prep["discussions"])."','".checked($prep["watches"])."','".checked($prep["paginator"])."', NOW())";
        
        if($done = mysql_query($str))
        {
            respond(
            array
            (
                "state" => "success",
                "message" => "Organisation added",
                "apikey" => $apikey
            ));
        }
        else
        {
            respond(
            array
            (
                "state" => "fail",
                "message" => "FAILED!... something went wrong :("
            ));
        }
    }
    else
    {
        respond(
        array
        (
            "state" => "fail",
            "message" => "A record for this company name already exists"
        ));
    }
    
}

function respond($result)
{
    echo json_encode($result);
}

function checked($val)
{
    if($val == "checked")
    {
        return 1;
    }
    else
    {
        return 0;
    }
}

function createAPIkey($val)
{
    return md5($val);
}

function prepForDB($str)
{
    return mysql_real_escape_string($str);
}


?>
