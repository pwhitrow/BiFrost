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
        $sql = "INSERT INTO users (user_id, email, password, gname, fname, joined) VALUES(UNIX_TIMESTAMP(), '".$_POST['email']."', '".$prep['password']."', '".$prep['gname']."', '".$prep['fname']."', NOW())";
        
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
    $sql = mysql_query("SELECT user_id FROM users WHERE email='".$email."'");

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
    $sql = mysql_query("SELECT * FROM users WHERE email='".$email."'");

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

    if(userExists($email))
    {
        $sql = mysql_query("SELECT * FROM users WHERE email='".$email."' AND password = '".$password."'");
        
        if(mysql_num_rows($sql) > 0)
        {
            $user = mysql_fetch_array($sql);
            
            // try gravatar
            $grav = checkGravatar($user['email']);

            // test avatar
            $user['avatar'] = checkAvatar($grav);

            mysql_query("UPDATE users SET avatar = '".$user['avatar']."' WHERE email = '".$email."'");

            loadUserSession($user);
            
            if($user['verified'])
            {
                setSuccessMsg(t('Login Successful'));
                $_SESSION['state'] = true;
                mysql_query("UPDATE users SET lastlogin = NOW() WHERE email = '".$email."'");
                return true;
            }
            else
            {
                $_SESSION['user'] = false;
                setErrorMsg(t('Login Failed!') . '<br /><br />' . t('User account not verified.'));
                return false;
            }
            
        }
        else
        {
           setErrorMsg(t('Login Failed!') . '<br /><br />' . t('Email or password incorrect.'));
           $_SESSION['state'] = false;
           $_SESSION['user'] = false;
           return false;
        }
    }
    else
    {
        setErrorMsg(t('Error!').'<br /><br />'.t('No user found for given email'));
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
        $sql = "UPDATE users SET email = '".$_POST['newemail']."' WHERE email = '".$_SESSION['user']['email']."'";

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
        $sql = "SELECT user_id FROM users WHERE password = '".$_POST['currentpassword']."' AND email = '".$_SESSION['user']['email']."'";
        
        $query = mysql_query($sql);
        
        if(mysql_num_rows($query) > 0)
        {
            $sql = "UPDATE users SET password = '".$_POST['newpassword']."' WHERE email = '".$_SESSION['user']['email']."'";

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
        
        $sql = "UPDATE users SET avatar = '".$_POST['avatar']."' WHERE email = '".$_SESSION['user']['email']."'";
        
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

?>