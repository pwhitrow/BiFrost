<?php
/*
    Document   : _bf_organisation.php
    Created on : 17-Dec-2011, 06:57:18
    Author     : Paul Whitrow
    Description: Visitor Review - Functions for organisation
*/

function getOrgDetails($api_key)
{
    $org = mysql_fetch_array(mysql_query("SELECT * FROM organisations WHERE api_key = '".$api_key."'"));
    
    return $org;
}

?>
