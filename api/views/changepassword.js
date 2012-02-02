/*
 * change password
 */

var formname = 'changepassword';

if(!$('._bf_' + formname + '_form').length)
{
    var _bf_changepassword = {
        
        init: function()
        {
            // create the form
            var form = $('<form />').attr(
            {
                method: 'post',
                action: formname,
                name: formname,
                'class': ' _bf_' + formname + '_form'
            });

            // create the inputs
            _bf.createFormElement(form, 
            {
                obj: 'input',
                type: 'password',
                name: 'currentpassword',
                value: '',
                cls: '_bf_input_password',
                title: _bf.t('Current Password')
            });

            _bf.createFormElement(form, 
            {
                obj: 'input',
                type: 'password',
                name: 'newpassword',
                value: '',
                cls: '_bf_input_password',
                title: _bf.t('New Password')
            });

            _bf.createFormElement(form, 
            {
                obj: 'input',
                type: 'password',
                name: 'confirmpassword',
                value: '',
                cls: '_bf_input_password',
                title: _bf.t('Confirm New Password')
            });

            // create the submit button
            var submit = $('<div />').attr(
            {
                'class': '_bf_button _bf_' + formname + '_submit'
            })
            .html(_bf.t('Set Password'))
            .click(function(event)
            {
                _bf.submitForm($(this).parent(), event);
            })
            .appendTo(form);

            $('._bf_dashboard')
            .append(form)
            .each(function()
            {
                _bf.checkPlaceholders($('._bf_' + formname + '_form'));
            })
        }
    }

    _bf_changepassword.init();
}



