<?php
/*
    Document   :    _bf_js.php
    Created on :    18-Nov-2011, 21:37:22
    Author     :    Paul Whitrow
    Description:    Minify js include files prior to returning request 

 
 */

if(!empty($_GET['start']))
{
    $file = $_SERVER['DOCUMENT_ROOT'].'/bifrost/api/_bf.js';
}
else
{
    $file = $_SERVER['DOCUMENT_ROOT']."/bifrost/".$_GET['src'];
}

if(stristr($file, '.js'))
{
    //header for the javascript file (will give a warning if not provided)
    header("content-type:text/javascript; charset:UTF-8");   
    
    //include minificator class
    //read and minify the content
    //require('./api/jsmin.php');
    //$minified = JSMin::minify(file_get_contents($file));
    $minified = file_get_contents($file);
    
    //header for caching
    header("Expires: ".gmdate("D, d M Y H:i:s", (time()+9000)) . " GMT");

    //send the minified version
    echo $minified;

}
?>
