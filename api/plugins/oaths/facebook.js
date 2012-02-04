// FACEBOOK API

var _bf_FB = new Array();

$('<div />').attr(
{
    'class': '_bf_login_fb'
})
.html("<fb:login-button size='small' autologoutlink='true' scope='email,status_update,publish_stream'></fb:login-button>")
.appendTo($('._bf_login_authenticators'))

window.fbAsyncInit = function() 
{
    FB.init(
    {
        appId: '221447911281191', 
        status: true, 
        cookie: true, 
        xfbml: true,
        oauth: true
    });

    FB.Event.subscribe('auth.login', function(response) 
    {
        FB.api('/me', function(response) 
        {
            _bf.processAction(
            {
              action: 'login'
            });
        });
    });

    FB.Event.subscribe('auth.logout', function(response) 
    {
        _bf.processAction(
        {
           action: 'logout'
        });
    });

    FB.getLoginStatus(function(response) 
    {
        //$('.fb_button_text').html(_bf.t('Connect'));
        
        if (response.status == 'connected') 
        {
            FB.api(
            {
                method: 'fql.query',
                query: 'SELECT uid,first_name,last_name,email,pic FROM user WHERE uid=me()'
            },
                function(response) 
                {
                    console.log(response);
                    //$('.fb_button_text').html(_bf.t('Disconnect'))
                }
            );
        }
    });
};

$('body').append('<div id="fb-root"></div>');

_bf_loadscript(document.location.protocol + '//connect.facebook.net/en_US/all.js');

