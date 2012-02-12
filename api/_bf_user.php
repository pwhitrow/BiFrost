<?php
/*
    Document   : _bf_user.php
    Created on : 27-Oct-2011, 21:37:22
    Author     : Paul Whitrow
    Description: user related functions
*/

function registerUser()
{
    $prep = array();
    
    foreach ($_POST as $k => $v)
    {
        $prep[$k] = prepForDB($v);
    }

    $_SESSION['state'] = false;
    
    // create a unique user id
    $userid = md5($_POST['email'].":".time());
    
    if(!userExists($_POST['email']))
    {        
        $sql = "INSERT INTO ".TABLEPRENAME."users (user_id, email, password, gname, fname, joined) VALUES('".$userid."', '".$_POST['email']."', '".$prep['password']."', '".$prep['gname']."', '".$prep['fname']."', NOW())";
        
        if(mysql_query($sql))
        {
            $sql = "INSERT INTO ".TABLEPRENAME."tempusers (user_id) VALUES('".$userid."')";
            
            mysql_query($sql);
            
            setSuccessMsg(t('Registration Accepted') . '<br /><br />' . t('Please check your email inbox to complete the registration process.'));

            registerEmail($prep, $userid);
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

function verifyUser()
{
    // check the user (token) exists i teh temp table
    $sql = "SELECT user_id FROM ".TABLEPRENAME."tempusers WHERE user_id = '".$_POST["token"]."'";
    
    // if user exists
    if(mysql_num_rows(mysql_query($sql)) > 0)
    {
        // remove the one time verify record
        $sql = "DELETE FROM ".TABLEPRENAME."tempusers WHERE user_id = '".$_POST["token"]."'";        
        mysql_query($sql);
        
        // update the user verification flag
        $sql = "UPDATE ".TABLEPRENAME."users SET verified = 1 WHERE user_id = '".$_POST["token"]."'";
        mysql_query($sql);
        
        setSuccessMsg(t('Registration verified!'));

    }
    else
    {
        // don't actually need to do anything!
        //setErrorMsg(t('User has already registered'));
    }
}

function forceFBemail($prep)
{
    if(empty($prep['email']) || $prep['email'] = "null")
    {
        return $prep['uid'].'@fb.com';
    }
    else
    {
        return $prep['email'];
    }
}

// Facebook login
function FBlogin()
{
    $prep = array();
    
    foreach ($_POST as $k => $v)
    {
        $prep[$k] = prepForDB($v);
    }
    
    $prep['email'] = forceFBemail($prep);
    
    $prep['password'] = md5(time());

    $_SESSION['state'] = false;
    
    // Are we registered with app?
    if(!userExists($prep['email']))
    {
        $sql = "INSERT INTO ".TABLEPRENAME."users (user_id, email, password, gname, fname, avatar, joined, fb_id, verified) VALUES(UNIX_TIMESTAMP(), '".$prep['email']."', '".$prep['password']."', '".$prep['gname']."', '".$prep['fname']."', '".$prep['avatar']."', NOW(), '".$prep['uid']."', 1)";
        
        if(mysql_query($sql))
        {
            setSuccessMsg(t('Registered via') + ' FaceBook');
            FBlogin2($prep);
        }
        else
        {
            setErrorMsg(mysql_error(), 'register');
            return false;
        }
    }
    else
    {
        FBlogin2($prep);
    }
}

function FBlogin2($prep)
{
    $prep['email'] = forceFBemail($prep);
    
    $org = getOrgDetails($prep["api_key"]);
    $sql = mysql_query("SELECT * FROM ".TABLEPRENAME."users WHERE email='".$prep['email']."'");

    if(mysql_num_rows($sql) > 0)
    {
        $user = mysql_fetch_array($sql);

        if($user['verified'])
        {
            if($user['enabled'])
            {
                $sql = "UPDATE ".TABLEPRENAME."users SET avatar = '".$prep['avatar']."', fb_id = '".$prep['uid']."', lastlogin = NOW(), verified = 1 WHERE email = '".$prep['email']."'";
                setSuccessMsg(t('Facebook Connected'));
                $_SESSION['state'] = true;
                mysql_query($sql);
                loadUserSession($user);           
            }
            else
            {
                logout();
                setErrorMsg(t('Facebook Login Failed!') . '<br /><br />' . t('User account disabled.') . '<br /><br />' . t('If you this there is a problem, please contact the administrator ') . $org['admin_email']);
                return false;                    
            }
        }
        else
        {
            logout();
            setErrorMsg(t('Facebook Login Failed!') . '<br /><br />' . t('User account not verified.') . '<br /><br />' . t('If you this there is a problem, please contact the administrator ') . $org['admin_email']);
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
        
        $sql = "UPDATE ".TABLEPRENAME."users SET avatar = '".$_POST['host'].MEDIA_LOCATION.'/'.basename($_POST['avatar'])."' WHERE email = '".$_SESSION['user']['email']."'";
        
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

function notifyWatchers($type, $relation, $apikey)
{
    $sql = "SELECT userid FROM ".TABLEPRENAME."watches WHERE relation='".$relation."' AND api_key='".$apikey."' AND type='".$type."'";
    
    $res = mysql_query($sql);
    
    $emails = array();
    
    while($r = mysql_fetch_array($res))
    {
        $sql = "SELECT email FROM ".TABLEPRENAME."users WHERE user_id='".$r["userid"]."' AND verified='1' and enabled='1'";
        $sql = mysql_fetch_array(mysql_query($sql));
        $emails[] = $sql["email"];
    }
    
    if($type == "reviews")
    {
        notifyUsersReviews($emails);
    }
    
    if($type == "discussions")
    {
        notifyUsersDiscussions($emails);
    }
    
    
}

?>