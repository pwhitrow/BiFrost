<?php
header('Content-Type: text/xml');

require('_bf_dbconnect.php');

$org = "SELECT name, description, url FROM ".TABLEPRENAME."organisations WHERE api_key='".$_REQUEST["apikey"]."'";

if($_REQUEST['type'] == 'reviews')
{
    $items = "SELECT id, title, content, DATE_FORMAT(posted,'%a, %e %b %Y %T') as fdate FROM ".TABLEPRENAME."reviews WHERE api_key='".$_REQUEST["apikey"]."' ORDER BY id DESC";
}
if($_REQUEST['type'] == 'discussions')
{
    $items = "SELECT id, 'Comment' as title, content, DATE_FORMAT(posted,'%a, %e %b %Y %T') as fdate FROM ".TABLEPRENAME."reviews WHERE api_key='".$_REQUEST["apikey"]."' ORDER BY id DESC";
}

$org = mysql_query($org) or die(mysql_error());
$items = mysql_query($items) or die(mysql_error());

$org = mysql_fetch_array($org);

echo '<?xml version="1.0" encoding="ISO-8859-1"?>
<rss version="2.0">
<channel>
<title>'.$org[name].'</title>
<description>'.$org[description].'</description>
<link>'.$org[url].'</link>'.PHP_EOL.PHP_EOL;

while ($item = mysql_fetch_array($items))
{
    echo PHP_EOL.'<item>'.PHP_EOL.
            '<title>'.cleanRSS($item[title]).'</title>'.PHP_EOL.
            '<description><![CDATA['.cleanRSS($item[content]).']]></description>'.PHP_EOL.
            '<guid>'.$org[url].'?reviewid='.$item[id].'</guid>'.PHP_EOL.
            '<pubDate>'.$item[fdate].' GMT</pubDate>'.PHP_EOL.
            '</item>'.PHP_EOL.PHP_EOL;
}
echo '</channel>
</rss>';

function cleanRSS($str)
{
    $str = stripslashes($str);
    $str = str_replace("&", "&amp;", $str);
    $str = htmlentities($str,ENT_QUOTES,'UTF-8');
    return $str;
}

?>