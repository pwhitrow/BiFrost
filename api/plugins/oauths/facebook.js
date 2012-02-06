/*
    Document   : facebook.js
    Created on : 04-Feb-2012, 04:30:05
    Author     : Paul Whitrow
    Description: Facebook API layer
*/

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
        fb_lib.loginToApp();
    });

    FB.Event.subscribe('auth.logout', function(response) 
    {
        _bf.processAction(
        {
            action: 'logout',
            api_error: false
        });

        $('.fb-root').hide();
    });

    FB.getLoginStatus(function(response) 
    {
        if (response.status == 'connected') 
        {
            fb_lib.loginToApp();
        }
    });
};

var fb_lib = {
    
    init: function()
    {
        _bf_loadscript(_bf.host + 'api/plugins/oauths/facebook.css');
        _bf_loadscript(document.location.protocol + '//connect.facebook.net/en_US/all.js');

        if(!$('.fb-root').length)
        {
            $('body').append('<div id="fb-root" class="fb-root"></div>');
            
            $('<div />').attr(
            {
                'class': '_bf_login_fb'
            })
            .html("<fb:login-button size='small' autologoutlink='true' scope='email,status_update,publish_stream'></fb:login-button>")
            .hide()
            .appendTo($('._bf_state'))
        }
    },
    
    loginToApp: function()
    {
        _bf.showStateOverlay(_bf.t('Please wait...'), 99999);
        
        fb_lib.button('hide');
        
        FB.api(
        {
            method: 'fql.query',
            query: 'SELECT uid,first_name,last_name,email,pic FROM user WHERE uid=me()'
        },
            function(response) 
            {
                var response = response[0];

                var params = 
                {
                    action: 'fb_login',
                    uid: response.uid,
                    fname: response.first_name,
                    sname: response.last_name,
                    email: response.email,
                    avatar: response.pic,
                    password: 'fbuser'
                };

                _bf.post(params);

            }
        );       
    },
    
    postToWall: function(title, msg, link, type)
    {
        FB.api('/me/feed', 'post', 
        { 
            title: title,
            message: msg,
            link: link,
            type: type
        }, 
        function(response) 
        {
          if (!response || response.error) {
            //alert('Error occured');
          } else {
            //alert('Post ID: ' + response.id);
          }
        });        
    },
    
    logout: function()
    {
        FB.getLoginStatus(function(response) 
        {
            if (response.status == 'connected') 
            {
                FB.logout();
            }
        });
    },
    
    loggedin: function()
    {
        if (FB._userStatus == 'connected') 
        {
            return true;
        }
        else
        {
            return false;
        }
    },
    
    button: function(type)
    {
        if(type == 'hide')
        {
            $('._bf_login_fb').hide();           
        }
        
        if(type == 'show')
        {
            $('._bf_login_fb').fadeIn(_bf.ani_speed);           
        }
    }
}

fb_lib.init();

