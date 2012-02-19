/* 
    Document   : admin.js
    Created on : 11-Feb-2012, 01:04:27
    Author     : Paul Whitrow
    Description: All admin Javacripts
*/
$(document).ready(function() 
{
    checkPlaceholders()
    
    // oganisation admin
    if($('#saveclient').length)
    {
        $('#saveclient').click(function()
        {
            if(validForm($('.clientSignupForm')))
            {
                var params = 
                {
                    'action': 'signup',
                    'name': $('#name').val(),
                    'url': $('#url').val(),
                    'description': $('#description').val(),
                    'tel': $('#tel').val(),
                    'address': $('#address').val(),
                    'replytoemail': $('#replytoemail').val(),
                    'adminemail': $('#adminemail').val(),
                    'contactname': $('#contactname').val(),
                    'contactemail': $('#contactemail').val(),
                    'reviews': $('#reviews').attr('checked'),
                    'discussions': $('#discussions').attr('checked'),
                    'watches': $('#watches').attr('checked')
                }

                $.post('_bf_org_admin.php', params,
                function(data)
                {
                    response(data, $('.clientSignupForm'));
                })
            }
        })
        
    }
    
});

function response(data, form)
{
    var result = $.parseJSON(data);
    
    message(result.message);
    
    if(result.state == 'success')
    {
        // clear form
//        form.find('input[type=text]').val('');
//        form.find('textarea').val('');
//        form.find('input[type=checkbox]').attr('checked', 'checked');

        form.find('input[type=text]')
            .attr('disabled', 'disabled')
            .css({'background':'transparent', 'color': '#6C6C6C'});
        form.find('textarea')
            .attr('disabled', 'disabled')
            .css({'background':'transparent', 'color': '#6C6C6C'});
        form.find('input[type=checkbox]')
            .attr('checked', 'checked')
            .attr('disabled', 'disabled')
            .css({'background':'transparent', 'color': '#6C6C6C'});

        // display new API key
        $('<li />').attr(
        {
            'class': 'formrow'
        })
        .each(function()
        {
            $('<label />').attr(
            {
                'class': 'formlabel',
                'for': 'compapikey'
            })
            .html('API Key')
            .appendTo($(this));
            
            $('<input />').attr(
            {
                'class': 'formtextbox',
                'id': 'compapikey',
                'type': 'text'
            })
            .val(result.apikey)
            .appendTo($(this));
        })
        .prependTo($('.formrows'))

    }
}

function validForm(form)
{
    var valid = true;

    form.find('.required').each(function()
    {
        var label = $(this).parent().find('label').html();
        
        if($(this).val() == '')
        {
            valid = false;
            message('Oops, you missed : ' + label);
            return false;
        }
    })

    return valid;
}

function isValidEmail(email)
{
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if(reg.test(email) == false)
    {
        return false;
    }
    else
    {
        return true;
    }
}

function message()
{
    alert(msg)
}

// placeholder text swap out for inputs
function checkPlaceholders()
{
    if($('form').length)
    {
        $('form').find('.formrow').each(function()
        {
            var label = $(this).find('label');
            var input = $(this).find('input');
            var texta = $(this).find('textarea');

            if(input.length)
            {
                var field = input;
            }
            else
            {
                var field = texta;
            }

            var pos = field.position();

            if(!label.hasClass('pos-fixed'))
            {
                // browser variations... natch!
                var offSet = 22;
                if($.browser.webkit) offSet = 19;
                if($.browser.msie) offSet = 18;

                label.css(
                {
                    position: 'absolute',
                    top: '0px',
                    //left: pos.left + 31 + 'px'
                    left: '60px'
                })
                .addClass('pos-fixed')
                .each(function()
                {
                    field.focus(function()
                    {
                        label.fadeTo(200, 0).hide();
                    })
                    .blur(function()
                    {
                        if($(this).val() == '')
                        {
                            label.show().fadeTo(200, 1);
                        }
                    })

                    if(field.val() != '')
                    {
                        label.fadeTo(200, 0).hide();
                    }
                });
            }
        })        
    }
}

