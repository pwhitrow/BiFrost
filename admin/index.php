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
        <title>Organisation Signup</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        
        <link href="_bf_admin.css" rel="stylesheet">
        
        <script src="/api/libs/jquery.1.7.min.js" type="text/javascript"></script>
        <script src="./_bf_admin.js" type="text/javascript"></script>
        
    </head>
    
    <body>
        
        <div class="header">
            <h1><strong>Organisation</strong> <em>Signup</em></h1>
        </div>
        
        
        <div class="content">
            
            <form action="" method="post" class="clientSignupForm">
                
                <ul class="formrows">
                    <li class="formrow">
                        <label for="name" class="formlabel">Name</label>
                        <input type="text" name="clientname" id="name" class="formtextbox required" value="" />
                    </li>
                    <li class="formrow">
                        <label for="url" class="formlabel">URL</label>
                        <input type="text" name="url" id="url" class="formtextbox required" value="" />
                    </li>
                    <li class="formrow">
                        <label for="description" class="formlabel">Description</label>
                        <input type="text" name="description" id="description" class="formtextbox required" value="" />
                    </li>
                    <li class="formrow">
                        <label for="address" class="formlabel">Address</label>
                        <textarea name="address" id="address" class="formtextarea"></textarea>
                    </li>
                    <li class="formrow">
                        <label for="tel" class="formlabel">Tel</label>
                        <input type="text" name="tel" id="tel" class="formtextbox required" value="" />
                    </li>
                    <li class="formrow">
                        <label for="replytoemail" class="formlabel">Reply-to email</label>
                        <input type="text" name="replytoemail" id="replytoemail" class="formtextbox required" value="" />
                    </li>
                    <li class="formrow">
                        <label for="adminemail" class="formlabel">Admin Email</label>
                        <input type="text" name="adminemail" id="adminemail" class="formtextbox required" value="" />
                    </li>
                    <li class="formrow">
                        <label for="contactname" class="formlabel">Contact Name</label>
                        <input type="text" name="contactname" id="contactname" class="formtextbox required" value="" />
                    </li>
                    <li class="formrow">
                        <label for="contactemail" class="formlabel">Contact Email</label>
                        <input type="text" name="contactemail" id="contactemail" class="formtextbox required" value="" />
                    </li>
                    <li class="formrow">
                        <label for="reviews" class="formlabel">Reviews</label>
                        <input type="checkbox" name="reviews" id="reviews" class="formcheckbox" checked="checked" />
                    </li>
                    <li class="formrow">
                        <label for="discussions" class="formlabel">Discussions</label>
                        <input type="checkbox" name="discussions" id="discussions" class="formcheckbox" checked="checked" />
                    </li>
                    <li class="formrow">
                        <label for="watches" class="formlabel">Watches</label>
                        <input type="checkbox" name="watches" id="watches" class="formcheckbox" checked="checked" />
                    </li>
                    <li class="formrow">
                        <label for="paginator" class="formlabel">Paginator</label>
                        <input type="checkbox" name="paginator" id="paginator" class="formcheckbox" checked="checked" />
                    </li>
                    <li class="formrow">
                        <input type="button" name="saveclient" id="saveclient" class="button" value="Save" />
                    </li>
                </ul>    
                
            </form>
            
        </div>
    </body>
    
</html>
