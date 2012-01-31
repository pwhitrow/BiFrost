<?php
/*
    Document   : _bf_tags.php
    Created on : 18-Nov-2011, 18:04:02
    Author     : Paul Whitrow
    Description: process tags
*/

function getTags()
{
    $sql = mysql_query("SELECT * FROM ".TABLEPRENAME."tags WHERE api_key = '".$_POST['api_key']."' ORDER BY tagname ASC");

    $rows = array();

    while($r = mysql_fetch_array($sql))
    {
        $rows['tag_id'][] = $r['id'];
        $rows['tag_name'][] = $r['tagname'];
    }

    setResponse('tags', $rows);
}

function addTag()
{
    $sql = mysql_query("INSERT INTO ".TABLEPRENAME."tags (tagname, api_key) VALUES('".prepForDB($_POST['newtag'])."', '".$_POST['api_key']."')");

    getTags();
    
    setResponse('newtag', prepForDB($_POST['newtag']));
}

?>
