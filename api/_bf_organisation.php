<?php
/*
    Document   : _bf_organisation.php
    Created on : 17-Dec-2011, 06:57:18
    Author     : Paul Whitrow
    Description: Visitor Review - Functions for organisation
*/

function getOrgDetails($api_key)
{
    $sql = mysql_query("SELECT * FROM organisations WHERE api_key = '".$api_key."'");
    
    if(mysql_num_rows($sql) > 0)
    {
        $org = mysql_fetch_array($sql);
    
        return $org;
    }
    else
    {
        setErrorMsg(t('No organisation found for key'));
        return false;        
    }
}

?>
