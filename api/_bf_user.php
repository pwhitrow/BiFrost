<?php
/*
    Document   : _bf_user.php
    Created on : 27-Oct-2011, 21:37:22
    Author     : Paul Whitrow
    Description: Visitor Review - register a new user and sent them an email to verify
*/

function registerUser()
{
    $prep = array();
    
    foreach ($_POST as $k => $v)
    {
        $prep[$k] = prepForDB($v);
    }

    $_SESSION['state'] = false;
    
    if(!userExists($_POST['email']))
    {
        $sql = "INSERT INTO ".TABLEPRENAME."users (user_id, email, password, gname, fname, joined) VALUES(UNIX_TIMESTAMP(), '".$_POST['email']."', '".$prep['password']."', '".$prep['gname']."', '".$prep['fname']."', NOW())";
        
        logger($sql);
    
        if(mysql_query($sql))
        {
            setSuccessMsg(t('Registration Successful') . '<br /><br />' . t('Please check your inbox for confirmation email.'));

            // SEND EMAIL!!!!
        }
        else
        {
            setErrorMsg(mysql_error(), 'register');
            return false;
        }
    }
    else
    {
        setErrorMsg(t('This email is already registered'));
        return false;
    }
}

function userExists($email)
{
    $sql = mysql_query("SELECT user_id FROM ".TABLEPRENAME."users WHERE email='".$email."'");

    if(mysql_num_rows($sql) != 0)
    {
        return true;
    }
    else
    {
        return false;
    }
}

function getUser($email)
{
    $sql = mysql_query("SELECT * FROM ".TABLEPRENAME."users WHERE email='".$email."'");

    if(mysql_num_rows($sql) != 0)
    {
        $_SESSION['user'] = false;
        
        $user = mysql_fetch_array($sql);

        loadUserSession($user);

        return true;
    }
    else
    {
        $_SESSION['user'] = false;
        return false;
    }
}

function loadUserSession($user)
{
    $_SESSION['user']['id'] = $user['user_id'];
    $_SESSION['user']['email'] = $user['email'];
    $_SESSION['user']['gname'] = $user['gname'];
    $_SESSION['user']['fname'] = $user['fname'];
    $_SESSION['user']['avatar'] = $user['avatar'];
    $_SESSION['user']['joined'] = $user['joined'];
    $_SESSION['user']['lastlogin'] = $user['lastlogin'];
    $_SESSION['user']['verified'] = $user['verified'];
    $_SESSION['user']['level'] = $user['level'];
}

function login($email, $password)
{
    global $defaultAvatar;
    
    $org = getOrgDetails($_POST["api_key"]);

    if(userExists($email))
    {
        $sql = mysql_query("SELECT * FROM ".TABLEPRENAME."users WHERE email='".$email."' AND password = '".$password."'");
        
        if(mysql_num_rows($sql) > 0)
        {
            $user = mysql_fetch_array($sql);
            
            if($user['verified'])
            {
                if($user['enabled'])
                {
                    setSuccessMsg(t('Login Successful'));
                    $_SESSION['state'] = true;
                    $grav = checkGravatar($user['email']);
                    $user['avatar'] = checkAvatar($grav);
                    mysql_query("UPDATE ".TABLEPRENAME."users SET avatar = '".$user['avatar']."', lastlogin = NOW() WHERE email = '".$email."'");
                    loadUserSession($user);           
                    return true;                    
                }
                else
                {
                    logout();
                    setErrorMsg(t('Login Failed!') . '<br /><br />' . t('User account disabled.') . '<br /><br />' . t('If you this there is a problem, please contact the administrator ') . $org['admin_email']);
                    return false;                    
                }
            }
            else
            {
                logout();
                setErrorMsg(t('Login Failed!') . '<br /><br />' . t('User account not verified.') . '<br /><br />' . t('If you this there is a problem, please contact the administrator ') . $org['admin_email']);
                return false;
            }
            
        }
        else
        {
           logout();
           setErrorMsg(t('Login Failed!') . '<br /><br />' . t('Email or password incorrect.') . '<br /><br />' . t('If you this there is a problem, please contact the administrator ') . $org['admin_email']);
           return false;
        }
    }
    else
    {
        logout();
        setErrorMsg(t('Error!').'<br /><br />'.t('No user found for given email') . '<br /><br />' . t('If you this there is a problem, please contact the administrator ') . $org['admin_email']);
        return false;
    }
}

function logout()
{
    $_SESSION['state'] = false;
    $_SESSION['user'] = false;
}

function changeEmail()
{
    if(permitted())
    {
        $sql = "UPDATE ".TABLEPRENAME."users SET email = '".$_POST['newemail']."' WHERE email = '".$_SESSION['user']['email']."'";

        if(mysql_query($sql))
        {
            getUser($_POST['newemail']);
            setSuccessMsg(t('Email address updated'));
            return true;
        }
        else
        {
            setErrorMsg(t('Failed to update email'));
            return false;
        }
    }
    else
    {
        setErrorMsg(t('Failed to update email, not logged in'));
        return false;
    }
}

function changePassword()
{
    if(permitted())
    {
        $sql = "SELECT user_id FROM ".TABLEPRENAME."users WHERE password = '".$_POST['currentpassword']."' AND email = '".$_SESSION['user']['email']."'";
        
        $query = mysql_query($sql);
        
        if(mysql_num_rows($query) > 0)
        {
            $sql = "UPDATE ".TABLEPRENAME."users SET password = '".$_POST['newpassword']."' WHERE email = '".$_SESSION['user']['email']."'";

            if(mysql_query($sql))
            {
                setSuccessMsg(t('Password updated'));
                return true;
            }
            else
            {
                setErrorMsg(t('Failed to update password'));
                return false;
            }
        }
        else
        {
            setErrorMsg(t('Current password incorrect'));
            return false;
        }
    }
    else
    {
        setErrorMsg(t('Failed to update password, not logged in'));
        return false;
    }
}

function changeAvatar()
{
    if(permitted())
    {
        $img = '../'.MEDIA_LOCATION.'/'.basename($_POST['avatar']);
        
        _imageResize($img, $img, 100, 100);
        
        $sql = "UPDATE ".TABLEPRENAME."users SET avatar = '".$_POST['avatar']."' WHERE email = '".$_SESSION['user']['email']."'";
        
        if(mysql_query($sql))
        {
            getUser($_SESSION['user']['email']);
            setSuccessMsg(t('Avatar updated'));
            return true;
        }
        else
        {
            setErrorMsg(t('Failed to update avatar'));
            return false;
        }
    }    
    else
    {
        setErrorMsg(t('Failed to update avatar, not logged in'));
        return false;
    }
}

function checkGravatar($email)
{
    // Craft a potential url and test its headers
    $hash = md5($email);
    $uri = 'http://www.gravatar.com/avatar/' . $hash . '?d=404&s=100';
    $headers = @get_headers($uri);
    if (!preg_match("|200|", $headers[0]))
    {
        $has_valid_avatar = FALSE;
    } 
    else
    {
        $has_valid_avatar = $uri;
    }
    return $has_valid_avatar;
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
            $sql = "INSERT INTO ".TABLEPRENAME."watches (userid, relation, api_key, type) VALUES('".$_SESSION['user']['id']."', '".$_REQUEST['relation']."', '".$_REQUEST['api_key']."', '".$_REQUEST['type']."')";
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