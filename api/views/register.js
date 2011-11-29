/*
 * register
 */

var formname = 'register';

if(!$('._bf_' + formname + '_form').length)
{
    var _bf_register = {
        
        init: function()
        {
            // create the form
            var form = $('<form></form>').attr(
            {
                method: 'post',
                action: formname,
                name: formname,
                'class': '_bf_state_form _bf_' + formname + '_form'
            });

            // create the inputs
            _bf.createFormElement(form, 
            {
                obj: 'input',
                type: 'text',
                name: 'email',
                value: '',
                title: _bf.t('Email')
            });

            _bf.createFormElement(form, 
            {
                obj: 'input',
                type: 'text',
                name: 'gname',
                value: '',
                title: _bf.t('Given name')
            });

            _bf.createFormElement(form, 
            {
                obj: 'input',
                type: 'text',
                name: 'fname',
                value: '',
                title: _bf.t('Family name')
            });

            _bf.createFormElement(form, 
            {
                obj: 'input',
                type: 'password',
                name: 'password',
                value: '',
                title: _bf.t('Password')
            });

            _bf.createFormElement(form, 
            {
                obj: 'input',
                type: 'password',
                name: 'password2',
                value: '',
                title: _bf.t('Confirm password')
            });


            var tandc = $('<div />').attr(
            {
                'class': '_bf_tandc'
            })
            .appendTo(form);

            var terms = $('<input />').attr(
            {
                type: 'checkbox',
                name: 'terms',
                id: 'terms',
                'class': '_bf_' + formname + '_terms',
                checked: false
            })
            .prependTo(tandc);

            var label = $('<label />').attr(
            {
                'class': '_bf_' + formname + '_label',
                'for': 'terms'
            })
            .html(_bf.t('Check this box to confirm you have read our')+'<br /><a href="http://termsandconditions.visitorreview.org/" title="'+_bf.t('Read our Terms & Conditions, and Privacy Policy')+'">'+_bf.t('Terms & Conditions, and Privacy Policy')+'</a>')
            .appendTo(tandc);

            // create the submit button
            var submit = $('<div />').attr(
            {
                'class': '_bf_button _bf_' + formname + '_submit'
            })
            .html(_bf.t('Register'))
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
    
    _bf_register.init();
}

