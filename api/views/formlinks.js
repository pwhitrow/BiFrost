/*
 * create the form links
 */

var _bf_formlinks = {

    init: function()
    {
        var form = $('._bf_'+formname+'_form');
        
        // Create the register/password links
        var links = $('<ul />').attr(
        {
            'class': '_bf_form_links _bf_'+formname+'_links'
        }
        ).appendTo(form);

        var reg = $('<li />').attr(
        {
            title: _bf.t('Click here to register'),
            'class': '_bf_form_link'
        }
        ).html(_bf.t('Register'))
        .click(function(event)
        {
            _bf.openPanel(393, 440, function()
            {
                _bf.getForm({form: 'register'});
            });
        });

        var login = $('<li />').attr(
        {
            title: _bf.t('Click here to login'),
            'class': '_bf_form_link'
        }
        ).html(_bf.t('Login'))
        .click(function(event)
        {
            _bf.openPanel(246, 440, function()
            {
                _bf.getForm({form:'login'});
            });
        });           

        var forgot = $('<li />').attr(
        {
            title: _bf.t('Click here to reset your password'),
            'class': '_bf_form_link'
        }
        ).html(_bf.t('Forgotten Password?'))
        .click(function(event)
        {
            _bf.openPanel(230, 440, function()
            {
                _bf.getForm({form:'forgottenpassword'});
            });
        });

        if(formname == 'login')
        {
            reg.appendTo(links);
            forgot.appendTo(links);
        }

        if(formname == 'register')
        {
            login.appendTo(links);
            forgot.appendTo(links);
        }

        if(formname == 'forgottenpassword')
        {
            login.appendTo(links);
            reg.appendTo(links);
        }
    }
}

_bf_formlinks.init();
    

