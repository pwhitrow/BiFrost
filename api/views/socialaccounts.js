/*
    Document   : socialaccounts.js
    Created on : 08-Feb-2012, 12:59:10
    Author     : Paul Whitrow
    Description: Login and out of social accounts
*/

var formname = 'socialaccounts';

var _bf_socialaccounts = {

    authenticators: [
        'Facebook', 
        'Twitter', 
        //'Google', 
        //'OpenID', 
        'LinkedIn'],

    init: function()
    {      
        // create the form
        var form = $('<form />').attr(
        {
            method: 'post',
            action: formname,
            name: formname,
            'class': ' _bf_' + formname + '_form'
        })
        .hide()
        .each(function()
        {
            $('<ul />').attr(
            {
                'class': '_bf_social_authenticators'
            })
            .appendTo($(this))
            .each(function()
            {
                for(var i = 0; i < _bf_socialaccounts.authenticators.length; i++)
                {
                    $('<li />').attr(
                    {
                        'class': '_bf_social_authenticator _bf_social_' + _bf_socialaccounts.authenticators[i].toLowerCase(),
                        'rel': _bf_socialaccounts.authenticators[i]
                    })
                    .appendTo($(this))
                    .each(function()
                    {
                        //  hook each account to it's own API functions
                        if($(this).attr('rel') == 'Facebook')
                        {
                            if(fb_lib.loggedin())
                            {
                                $(this)
                                .css(
                                {
                                    'background-position': '-264px -50px'
                                })
                                .html(_bf.t('Disconnect'))
                                .click(function()
                                {
                                    fb_lib.logout();
                                })
                            }
                            else
                            {
                                $(this)
                                .html(_bf.t('Connect'))
                                .click(function()
                                {
                                    fb_lib.login();
                                })
                            }
                        }
                        
                        if($(this).attr('rel') == 'Twitter')
                        {
                            $(this)
                            .html(_bf.t('Connect'))
                            .click(function()
                            {
                                _bf.showStateOverlay(_bf.t('Nothing to see yet!'))
                            })
                        }
                        
                        if($(this).attr('rel') == 'LinkedIn')
                        {
                            $(this)
                            .html(_bf.t('Connect'))
                            .click(function()
                            {
                                _bf.showStateOverlay(_bf.t('Nothing to see yet!'))
                            })
                        }
                    })
                }
            })           
        });
        
        
        $('._bf_dashboard')
        .append(form)
        .each(function()
        {
            form.fadeIn(_bf.ani_speed);
        });

    }
}

_bf_socialaccounts.init();




