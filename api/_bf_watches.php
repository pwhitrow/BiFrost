<?php
/*
    Document   : _bf_watches.php
    Created on : 27-Jan-2011, 01:55:32
    Author     : Paul Whitrow
    Description: Process item watches
*/

function getUserWatches()
{
    global $result;

    $sql = "SELECT * FROM ".TABLEPRENAME."watches WHERE userid = '".$_SESSION['user']['id']."' AND api_key = '".$_POST['api_key']."' ORDER BY id DESC";

    $sql = mysql_query($sql);

    $rows = array();
    
    while($r = mysql_fetch_assoc($sql))
    {
        $rows[] = $r;
    }

    setResponse('userwatches', json_encode($rows));
}

function watchViaEmail()
{
    if(!empty($_SESSION['user']['id']))
    {
        $sql = "SELECT userid FROM ".TABLEPRENAME."watches WHERE userid='".$_SESSION['user']['id']."' AND type='".$_REQUEST['type']."' AND relation='".$_REQUEST['relation']."' AND api_key='".$_REQUEST['api_key']."'";
        
        $sql = mysql_query($sql);
        if(mysql_num_rows($sql))
        {
            setErrorMsg(t('Watch already set'));
        }
        else
        {
            $sql = "INSERT INTO ".TABLEPRENAME."watches (userid, relation, api_key, type, title) VALUES('".$_SESSION['user']['id']."', '".$_REQUEST['relation']."', '".$_REQUEST['api_key']."', '".$_REQUEST['type']."', '".$_REQUEST['title']."')";
            mysql_query($sql);
            setSuccessMsg(t('Watch set'));
        }        
    }
    else
    {
        setErrorMsg(t('Please Login'));
    }  
}


?>