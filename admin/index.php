<?php
/*
    Document   : index.php
    Created on : 10-Feb-2011, 14:46:22
    Author     : Paul Whitrow
    Description: main index file for admin side
*/

require('./_bf_admin_include.php');



?>

<!DOCTYPE html>
<html>
    <head>
        <title>Client Signup</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    
    <body>
        <h1>Client Signup</h1>
        
        <div class="content">
            
            <form action="" method="post" class="clientSignupForm">
                
                <ul class="formrows">
                    <li class="formrow">
                        <label for="name" class="formlabel">Name</label>
                        <input type="text" name="clientname" id="name" class="formtextbox" value="" />
                    </li>
                    <li class="formrow">
                        <label for="url" class="formlabel">URL</label>
                        <input type="text" name="url" id="url" class="formtextbox" value="" />
                    </li>
                    <li class="formrow">
                        <label for="description" class="formlabel">Description</label>
                        <input type="text" name="description" id="description" class="formtextbox" value="" />
                    </li>
                    <li class="formrow">
                        <label for="address" class="formlabel">Address</label>
                        <textarea name="address" id="address" class="formtextarea"></textarea>
                    </li>
                    <li class="formrow">
                        <label for="tel" class="formlabel">Tel</label>
                        <input type="text" name="tel" id="tel" class="formtextbox" value="" />
                    </li>
                    <li class="formrow">
                        <label for="replytoemail" class="formlabel">Reply-to email</label>
                        <input type="text" name="replytoemail" id="replytoemail" class="formtextbox" value="" />
                    </li>
                    <li class="formrow">
                        <label for="reviews" class="formlabel">Reviews</label>
                        <input type="checkbox" name="reviews" id="reviews" class="formtextbox" value="0" />
                    </li>
                    <li class="formrow">
                        <label for="discussions" class="formlabel">Discussions</label>
                        <input type="checkbox" name="discussions" id="discussions" class="formtextbox" value="0" />
                    </li>
                    <li class="formrow">
                        <label for="watches" class="formlabel">Watches</label>
                        <input type="checkbox" name="watches" id="watches" class="formtextbox" value="0" />
                    </li>
                    <li class="formrow">
                        <label for="contactname" class="formlabel">Contact Name</label>
                        <input type="text" name="contactname" id="contactname" class="formtextbox" value="" />
                    </li>
                    <li class="formrow">
                        <label for="contactemail" class="formlabel">Contact Email</label>
                        <input type="text" name="contactemail" id="contactemail" class="formtextbox" value="" />
                    </li>
                </ul>    
                
            </form>
            
        </div>
    </body>
    
</html>
