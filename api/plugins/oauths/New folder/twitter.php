<?php
require("twitteroauth/twitteroauth.php");  
require("twitteroauth/twitter_config.php");  
session_start(); 

// are we a return path?
if(!empty($_GET['oauth_verifier']) && !empty($_SESSION['oauth_token']) && !empty($_SESSION['oauth_token_secret']))
{
    // We've got everything we need
    // TwitterOAuth instance, with two new parameters we got in twitter_login.php
    $twitteroauth = new TwitterOAuth(KEY, SECRET, $_SESSION['oauth_token'], $_SESSION['oauth_token_secret']);
    // Let's request the access token
    $access_token = $twitteroauth->getAccessToken($_GET['oauth_verifier']);
    // Save it in a session var
    $_SESSION['access_token'] = $access_token;
    // Let's get the user's info
    $user_info = $twitteroauth->get('account/verify_credentials');
    // Print user's info
    print_r($user_info);
} 
else 
{
    // The TwitterOAuth instance
    $twitteroauth = new TwitterOAuth(KEY, SECRET);
    // Requesting authentication tokens, the parameter is the URL we will be redirected to
    $request_token = $twitteroauth->getRequestToken(CALLBACKURL);

    // Saving them into the session
    $_SESSION['oauth_token'] = $request_token['oauth_token'];
    $_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];

    // If everything goes well..
    if($twitteroauth->http_code==200){
        // Let's generate the URL and redirect
        $url = $twitteroauth->getAuthorizeURL($request_token['oauth_token']);
        header('Location: '. $url);
    } else {
        // It's a bad idea to kill the script, but we've got to know when there's an error.
        die('Something wrong happened.');
    }
}

 
?>