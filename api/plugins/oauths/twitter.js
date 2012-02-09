/*
    Document   : twitter.js
    Created on : 08-Feb-2012, 05:11:05
    Author     : Paul Whitrow
    Description: @Anywhere Twitter API layer
*/

_bf_loadscript('http://platform.twitter.com/anywhere.js?id=TpFpAahek1cU3GTTurVA&v=1')

var tw_lib = {
    
    init: function()
    {
        if(!$('._bf_login_tw').length)
        {            
            $('<div />').attr(
            {
                'class': '_bf_login_tw'
            })
            .html(_bf.t('Log In'))
            .appendTo($('._bf_state'))
            .hide()
            .click(function()
            {
                tw_lib.login();
            })
            .each(function()
            {
                tw_lib.APIready();
            })
        }
    },
    
    APIready: function()
    {
        if(typeof twttr == 'undefined')
        {
            setTimeout(function()
            {
                tw_lib.APIready();
            }, 
            500)
        }
        else
        {
            twttr.anywhere(function (T) 
            {
                T($(this)).connectButton();
                
                T.bind("authComplete", function (e, user) 
                {
                    // triggered when auth completed successfully
                    tw_lib.loggedin(user);
                });

                T.bind("signOut", function (e) 
                {
                    // triggered when user logs out
                    console.log("TW logged out")
                });
            });                           
        }
    },
    
    loggedin: function(user)
    {
        twttr.anywhere(function (T) 
        {
            if (T.isConnected()) 
            {
            var me = new Array();
                console.log(user)
//                user['uid'] = currentUser.data('id');
//                user['fname'] = currentUser.data('name');
//                user['sname'] = currentUser.data('name');
//                user['email'] = currentUser.data('id');
//                user['avatar'] = currentUser.data('profile_image_url');
                
                return user;
            } 
            else 
            {
                return false;
            };
        });
        return false;
    },
    
    loginToApp: function(response)
    {
        _bf.showStateOverlay(_bf.t('Please wait...'), 99999);
        
        tw_lib.button('hide');
        
        var response = response[0];

        var params = 
        {
            action: 'tw_login',
            uid: response.uid,
            fname: response.first_name,
            sname: response.last_name,
            email: response.email,
            avatar: response.pic,
            password: 'twuser'
        };

        _bf.post(params);
   
    },
    
    logout: function()
    {
        twttr.anywhere.signOut();
    },
    
    login: function()
    {
        twttr.anywhere(function (T) 
        {
            T.signIn();
        });                           
    },
    
    button: function(type)
    {
        if(type == 'hide')
        {
            $('._bf_login_tw').hide();           
        }
        
        if(type == 'show')
        {
            $('._bf_login_tw').fadeIn(_bf.ani_speed);           
        }
    }
    
}

tw_lib.init();
