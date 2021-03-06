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
        oauth: true,
        authResponse: true
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
};

var fb_lib = {
    
    FBwin: false,
    
    init: function()
    {
        
        _bf_loadscript('//connect.facebook.net/en_US/all.js');

        if(!$('.fb-root').length)
        {
            $('._bf_state').append('<div id="fb-root" class="fb-root"></div>');
            
            $('<div />').attr(
            {
                'class': '_bf_login_fb'
            })
            //.html('<fb:login-button v="2" autologoutlink="true" scope="email,publish_stream"></fb:login-button>' + _bf.t('Login'))
            .html(_bf.t('Login'))
            .hide()
            .appendTo($('._bf_state'))
            .click(function()
            {
                fb_lib.login();
            })
        }
    },
    
    loginToApp: function()
    {
        _bf.showStateOverlay(_bf.t('Please wait') + '...', 99999);
        
        _bf.hideSocialAuthenticators();
        
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
                    gname: response.first_name,
                    fname: response.last_name,
                    email: response.email,
                    avatar: response.pic
                };

                _bf.post(params);

            }
        );       
    },
    
    postToWall: function(result, type)
    {
        var pic = result.media.split(',');
        if(pic.length > 0)
        {
            pic = _bf.host + _bf.uploads + '/' + pic[0].replace('//', '/');
        }
        else
        {
            pic = '';
        }

        FB.api('/me/feed', 'post', 
        { 
            title: result.title,
            message: result.content,
            link: result.pageURL,
            type: type,
            picture: pic
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
    
    login: function()
    {
        if(fb_lib.loggedin())
        {
            fb_lib.loginToApp();
        }
        else
        {
            //FB.login();
            fb_lib.FBwin = window.open("https://www.facebook.com/dialog/oauth?client_id=221447911281191&redirect_uri="+_bf.host+"api/plugins/oauths/fbloggedin.html?closeFBwindow=true&scope=email,publish_stream&response_type=code", "FB", "toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,height=500,width=950");
        }
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

