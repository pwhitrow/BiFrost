<?php
/*
    Document   : _bf_dbconnect.php
    Created on : 27-Oct-2011, 21:37:22
    Author     : Paul Whitrow
    Description: connect to appropriate DB for environment
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
    case 'bifrost': 
        // staging (bifrost.pwhitrow.com)
        $site['username'] = "pwhitrowc1";
        $site['password'] = "ghhm9ab7";
        $site['host'] = "79.99.43.21";
        $site['db'] = "pwhitrowc1";
        break;
    default:
        // live
        $site['username'] = "";
        $site['password'] = "";
        $site['host'] = "";
        $site['db'] = "_bf";
        break;
}

mysql_connect($site['host'],$site['username'],$site['password']);
@mysql_select_db($site['db']) or die(mysql_error());


?>