<?php

// just a generic logging function to help debugging in PHP
function logger($data, $filename = 'debug')
{   
    $data = date('l jS \of F Y h:i:s A')
    .PHP_EOL
    .'*********************************************'
    .PHP_EOL
    .PHP_EOL
    .(is_array($data) ? print_r($data, true) : $data)
    .PHP_EOL
    .PHP_EOL;
    file_put_contents('logs/'.$filename.'.log', $data, FILE_APPEND);
}

?>