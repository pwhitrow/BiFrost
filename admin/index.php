<?php
/*
    Document   : index.php
    Created on : 10-Feb-2011, 14:46:22
    Author     : Paul Whitrow
    Description: Organisation signup/edit
*/

require('./_bf_admin_include.php');



?>

<!DOCTYPE html>
<html>
    <head>
        <title>Administration login</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        
        <link href="_bf_admin.css" rel="stylesheet">
        
        <script src="/api/libs/jquery.1.7.min.js" type="text/javascript"></script>
        <script src="./_bf_admin.js" type="text/javascript"></script>
        
    </head>
    
    <body>
        
        <div class="header">
            <h1><strong>Administration</strong> <em>login</em></h1>
        </div>
        
        
        <div class="content">
            
            <form action="" method="post" class="loginForm">
                
                <ul class="formrows">
                    <li class="formrow">
                        <label for="username" class="formlabel">Email</label>
                        <input type="text" name="username" id="username" class="formtextbox required" value="" />
                    </li>
                    <li class="formrow">
                        <label for="password" class="formlabel">Password</label>
                        <input type="text" name="password" id="password" class="formtextbox required" value="" />
                    </li>
                    <li class="formrow">
                        <input type="button" name="login" id="login" class="button" value="Login" />
                    </li>
                </ul>    
                
            </form>
            
        </div>
    </body>
    
</html>
