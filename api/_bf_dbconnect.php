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
        // development
        $site['username'] = "root";
        $site['password'] = "";
        $site['host'] = "localhost";
        $site['db'] = "_bf";
        break;
    default:
        // live
        $site['username'] = "webserver";
        $site['password'] = "localpassword:)";
        $site['host'] = "localhost";
        $site['db'] = "_bf";
        break;
}

mysql_connect($site['host'],$site['username'],$site['password']);
@mysql_select_db($site['db']) or die(mysql_error());



?>