/*
 * forgotten password
 */

var formname = 'forgottenpassword';

if(!$('._bf_' + formname + '_form').length)
{
    var _bf_forgottenpassword = {
        
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

            $('<p />').attr(
            {
                'class': '_bf_' + formname + '_msg'
            }
            )
            .html('Please enter your registered email address and we will send you a new password.')
            .appendTo(form);

            // create the submit button
            var submit = $('<div />').attr(
            {
                'class': '_bf_button _bf_' + formname + '_submit'
            })
            .html(_bf.t('Reset'))
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
    
    _bf_forgottenpassword.init();
}

