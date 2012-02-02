/*
 * login
 */

// we need the MD5 script!
_bf_loadscript(_bf.host + 'api/plugins/md5/jquery.md5.js');

var formname = 'login';

if(!$('._bf_' + formname + '_form').length)
{
    var _bf_login = {
        
        init: function()
        {
            // create the form
            var form = $('<form />').attr(
            {
                method: 'post',
                action: formname,
                name: formname,
                'class': '_bf_state_form _bf_' + formname + '_form'
            });

            // email
            _bf.createFormElement(form, 
            {
                obj: 'input',
                type: 'text',
                name: 'email',
                value: _bf.cookie('_bf_login_email'),
                title: _bf.t('Email')
            });
            
            // password
            _bf.createFormElement(form, 
            {
                obj: 'input',
                type: 'password',
                name: 'password',
                value: '',
                title: _bf.t('Password')
            });

            var store = $('<div />').attr(
            {
                'class': '_bf_' + formname + '_store'
            }
            ).appendTo(form);


            // create the submit button
            var submit = $('<div />').attr(
            {
                'class': '_bf_button _bf_' + formname + '_submit'
            })
            .html(_bf.t('Login'))
            .click(function(event)
            {
                _bf.submitForm($(this).parent(), event);
            })
            .appendTo(form);

             // append the form to the state panel
            _bf.state_panel.append(form);

            _bf.showFormLinks(formname);

            _bf.showSocialAuthenticators(form);

        }
    }
        
    _bf_login.init();
}


