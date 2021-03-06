/*
 * change email
 */

var formname = 'changeemail';

if(!$('._bf_' + formname + '_form').length)
{
    var _bf_changeemail = {
        
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
                type: 'text',
                name: 'newemail',
                value: '',
                cls: '_bf_input_email',
                title: _bf.t('New Email Address')
            });

            _bf.createFormElement(form, 
            {
                obj: 'input',
                type: 'text',
                name: 'confirmemail',
                value: '',
                cls: '_bf_input_email',
                title: _bf.t('Confirm New Email Address')
            });

            // create the submit button
            var submit = $('<div />').attr(
            {
                'class': '_bf_button _bf_' + formname + '_submit'
            })
            .html(_bf.t('Update Email'))
            .click(function(event)
            {
                _bf.submitForm($(this).parent(), event);
            })
            .appendTo(form);

            $('<p />').attr(
            {
                'class': '_bf_changeemail_text'
            })
            .html(_bf.t('Please note: If you change your email address you will need you use this new one to login. This change may also affect your Social Account logins'))
            .appendTo(form)
            
            $('._bf_dashboard')
            .append(form)
            .each(function()
            {
                _bf.checkPlaceholders($('._bf_' + formname + '_form'));
                $(this).fadeIn(_bf.ani_speed);
            });


        }
    }
    
    _bf_changeemail.init();
}



