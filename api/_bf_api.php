<?php
/*
    Document   : _bf_api.php
    Created on : 27-Oct-2011, 21:37:22
    Author     : Paul Whitrow
    Description: main PHP include
*/

header("Expires: Sat, 01 Jan 2000 00:00:00 GMT");
header("Last-Modified: ".gmdate("D, d M Y H:i:s")." GMT");
header("Cache-Control: post-check=0, pre-check=0",false);
header('Access-Control-Allow-Origin: *');

ini_set('max_execution_time','1800');
ini_set('upload_max_filesize','10M');
ini_set('post_max_size','20M');
ini_set('memory_limit', '50M');

//error_reporting(E_ALL);
//error_reporting(E_STRICT);


// load all api files
$_bf_files = glob("./" . "_bf_*.php");

foreach($_bf_files as $_bf_file)
{
    if(basename($_bf_file) == '_bf_api.php')
    {
        continue;
    }
    else
    {
        require_once($_bf_file);
    }
}

// NEW request will reload the page, but back/forward browser navigation won't force a reload
// If we do not set must-revalidate, IE seems to cache session variables without refreshing them
//session_cache_limiter('private_no_expire, must-revalidate');


// check the api_token sent from JS
// set the session to match token
if(isset($_POST['api_token']) &&
         $_POST['api_token'] != "" &&
         $_POST['api_token'] != "false" &&
         $_POST['api_token'] != false)
{
    if($_POST['api_token'] != session_id())
    {
        session_id($_POST['api_token']);
    }
    
}

session_start();

// set default sessions
if(empty($_SESSION['state']))
{
    $_SESSION['state'] = false;
    $_SESSION['org'] = false;
    $_SESSION['user'] = false;
}

// PROCESS

// globals
$result = $_POST;

// So, what are we doing?
switch($_POST['action'])
{
    case('verifynewsuser'):  // verify user
                    verifyUser();
                    respond();
                    break;

    case('fb_login'):  // facebook login
                    FBlogin();
                    respond();
                    break;

    case('register'):  // register a user
                    registerUser();
                    respond();
                    break;

    case('login'):  // do login
                    login(prepForDB($result['email']), prepForDB($result['password']));
                    respond();
                    break;

    case('logout'): // do logout
                    $_SESSION['state'] = false;
                    logout();
                    respond();
                    break;

    case('getstate'): // get current session state
                    respond();
                    break;

    case('changeemail'): // change email
                    changeEmail();
                    respond();
                    break;

    case('forgottenpassword'): // forgotten password
                    forgottenPassword();
                    respond();
                    break;

    case('changepassword'): // change email
                    changePassword();
                    respond();
                    break;

    case('changeavatar'): // change email
                    changeAvatar();
                    respond();
                    break;

    case('review'): // post review
                    postReview();
                    respond();
                    break;

    case('userreviews'): // get reviews
                    getUserReviews();
                    respond();
                    break;

    case('itemreviews'): // get item reviews
                    getItemReviews();
                    respond();
                    break;

    case('itemreviewsbytag'): // get item reviews
                    getItemReviewsByTag();
                    respond();
                    break;

    case('comment'): // post comment
                    postComment();
                    respond();
                    break;

    case('usercomments'): // get comments
                    getUserComments();
                    respond();
                    break;

    case('discuss'): // post discussion
                    postDiscussion();
                    respond();
                    break;

    case('userdiscussions'): // get discussions
                    getUserDiscussions();
                    respond();
                    break;

    case('itemdiscussions'): // get item discussions
                    getItemDiscussions();
                    respond();
                    break;

    case('tags'): // get reviews by tag
                    getTags();
                    respond();
                    break;

    case('addtag'): // add a tag
                    addTag();
                    respond();
                    break;

    case('watchviaemail'): // watch via email
                    watchViaEmail();
                    respond();
                    break;

    case('userwatches'): // get watches
                    getUserWatches();
                    respond();
                    break;

    case('removewatch'): // get watches
                    removeWatch();
                    respond();
                    break;

    case('translate'): // translate some text
                    t($_POST['str'], true);
                    respond();
                    break;

    default:        // catch all
                    $_SESSION['state'] = false;
                    respond();
                    break;

}



// FUNCTIONS

// translate text
function t($str, $fromJS = false)
{
    if($fromJS)
    {
        // translate $str
        $tx = array('tx' => $str);
        echo json_encode($tx);
    }
    else
    {
        return $str;
    }
}

function respond()
{
    global $result;

    // just in case the default 'false' token snuck through!
    if(!empty($_SESSION['api_token']) && 
             ($_SESSION['api_token'] == false ||
              $_SESSION['api_token'] == "false"))
    {
        session_regenerate_id(true);
    }

    $_SESSION['api_token'] = session_id();
    
    setResponse('appname', APP_NAME);
    
    $org = getOrgDetails($_REQUEST['api_key']);
    $_SESSION['org'] = $org;
    setResponse('orgName', $org['name']);
    setResponse('orgURL', $org['url']);
    setResponse('paginator', $org['paginator']);
    
    setResponse('api_token', $_SESSION['api_token']);
    setResponse('state', $_SESSION['state']);
    setResponse('uploads', MEDIA_LOCATION);
    
    setResponse('email', $_SESSION['user']['email']);
    setResponse('fname', $_SESSION['user']['fname']);
    setResponse('gname', $_SESSION['user']['gname']);
    setResponse('avatar', $_SESSION['user']['avatar']);
    setResponse('joined', $_SESSION['user']['joined']);
    setResponse('lastlogin', $_SESSION['user']['lastlogin']);
    setResponse('level', $_SESSION['user']['level']);

    // force removal of password from result, just in case!
    setResponse('password', NULL);

    echo json_encode($result);
}

function setResponse($k, $v)
{
    global $result;

    $result[$k] = $v;
}

function setSuccessMsg($str)
{
    global $result;

    $result['api_success'] = $str;
}

function setErrorMsg($str)
{
    global $result;

    $result['api_error'] = $str;
}

function prepForDB($str)
{
    return mysql_real_escape_string($str);
}

function permitted()
{
    if(($_SESSION['state'] == true) && ($_SESSION['api_token'] == $_POST['api_token']))
    {
        return true;
    }
    else
    {
        return false;
    }
}

function checkAvatar($avatar)
{
    $defaultAvatar = $_POST['host'].'images/avatar.jpg';

    if($avatar == '')
    {
        return $defaultAvatar;
    }

    if(!remoteFileExists($avatar))
    {
        return $defaultAvatar;
    }

    return $avatar;
}

function remoteFileExists($url)
{
	$handle = @fopen($url, "r");

        if ($handle === false)
        {
            return false;
        }
        else
        {
            fclose($handle);
            return true;            
        }
        
}

function safeHTML($str)
{
    $str = nl2br($str);
    //$str = ereg_replace("[[:alpha:]]+://[^<>[:space:]]+[[:alnum:]/]","<a href=\"\\0\">\\0</a>", $str);
    return $str;
}

?>