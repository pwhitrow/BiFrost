/*
 * create a comment
 */

var formname = 'comment';

if(_bf.loggedIn())
{
    if(!$('._bf_' + formname + '_form').length)
    {
        var _bf_comment = {


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

                // create the inputs
                _bf.createFormElement(form,
                {
                    obj: 'input',
                    type: 'hidden',
                    name: 'parentid',
                    value: '',
                    title: ''
                });

                _bf.createFormElement(form,
                {
                    obj: 'textarea',
                    name: 'content',
                    cols: '30',
                    rows: '8',
                    value: '',
                    title: _bf.t('Comment')
                });

                // create the submit button
                var submit = $('<div />').attr(
                {
                    'class': '_bf_button _bf_' + formname + '_submit'
                })
                .html(_bf.t('Submit'))
                .click(function(event)
                {
                    _bf.submitForm($(this).parent(), event);
                })
                .appendTo(form);

                _bf.state_panel.append(form)
                .each(function()
                {
                    $('._bf_state_actions').html($('<li />').attr(
                    {
                        'title': _bf.t('Click to close'),
                        'class': '_bf_state_action'
                    })
                    .html(_bf.t('Close'))
                    .click(function()
                    {
                        _bf.cleanUp($('._bf_' + formname + '_form'));

                        _bf.closePanel(function()
                        {
                            _bf.resizePanel(_bf.state_width_default, _bf.state_height_default);

                            _bf.showStateActions();
                        });
                     }));
                });
            }
        }

        _bf_comment.init();
    }
}


