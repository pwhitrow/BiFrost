<?php
/*
    Document   : _bf_admin_include.php
    Created on : 10-Feb-2011, 14:46:22
    Author     : Paul Whitrow
    Description: PHP include for all admin pages
*/


header("Expires: Sat, 01 Jan 2000 00:00:00 GMT");
header("Last-Modified: ".gmdate("D, d M Y H:i:s")." GMT");
header("Cache-Control: post-check=0, pre-check=0",false);
header('Access-Control-Allow-Origin: *');

ini_set('max_execution_time','1800');
ini_set('upload_max_filesize','10M');
ini_set('post_max_size','20M');
ini_set('memory_limit', '50M');

//error_reporting(E_ALL);

session_start();


require('../api/_bf_defines.php');
require('../api/_bf_dbconnect.php');

// GLOBAL FUNCTIONS

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
