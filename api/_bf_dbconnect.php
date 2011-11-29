<?php
/*
    Document   : _bf_dbconnect.php
    Created on : 27-Oct-2011, 21:37:22
    Author     : Paul Whitrow
    Description: Visitor Review - connect to appropriate DB for environment
*/


$s = explode('.',$_SERVER['SERVER_NAME']);

switch($s[0])
{
    case 'localhost':
    case 'dev':
        // development
        $site['username'] = "root";
        $site['password'] = "";
        $site['host'] = "localhost";
        $site['db'] = "_bf";
        break;
    case 'stg':
        // staging
        $site['username'] = "";
        $site['password'] = "";
        $site['host'] = "";
        $site['db'] = "_bf";
        break;
    default:
        // live
        $site['username'] = "";
        $site['password'] = "";
        $site['host'] = "";
        $site['db'] = "_bf";
        break;
}

mysql_pconnect($site['host'],$site['username'],$site['password']);
@mysql_select_db($site['db']) or die(mysql_error());


?>