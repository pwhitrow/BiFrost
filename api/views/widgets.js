/*
 * page widgets
 */

var _bf_widgets = {

    init: function()
    {   
        // clean up first
        if($('._bf_widget_buttons').length)
        {
            $('._bf_widget_buttons').remove();
        }
                    
        // create button row
        $('<ul />').attr(
        {
            'class': '_bf_widget_buttons'
        })
        .appendTo($('._bf_widgets'))
        .each(function()
        {
            _bf_widgets.renderButton('review', 'Review', 'Post a review', 425, 600);
            _bf_widgets.renderButton('discuss', 'Discuss', 'Start a discussion', 335, 600);
            //_bf_widgets.renderButton('watch', 'Watch', 'Watch this item', 500, 500);
            
            $('<li />').attr(
            {
                'class': '_bf_widget_socials'
            })
            .appendTo($(this))
            .each(function()
            {
//                if(!$('._bf_social_bookmarks').length)
//                {
//                    $(this).socials(
//                    {
//                        obj: $('._bf_widgets'),
//                        path: _bf.host + 'api/plugins/socials/'
//                    });
//                }
            });
            
        });

    },
    
    renderButton: function(type, txt1, txt2, h, w)
    {
        $('<li />').attr(
        {
            'class': '_bf_widget_button_holder',
            title: _bf.t(txt2)
        })
        .html(function()
        {
            
            $('<button />').attr(
            {
                'class': '_bf_widget_' + type
            })
            .html(_bf.t(txt1))
            .appendTo($(this))
            .click(function()
            {
                if(_bf.loggedIn())
                {
                    _bf.openPanel(h, w, function()
                    {
                        $('._bf_dashboard').remove();

                        _bf.getForm(
                        {
                            form: type,
                            parentid: $('._bf_widget_buttons').parent().attr('rel')
                        });
                    });
                }
                else
                {
                    _bf_widgets.cannotPost();
                }
            })
            .each(function()
            {
                if(_bf.loggedIn())
                {
                    $(this)
                    .addClass('_bf_widget_button')
                    .removeClass('_bf_widget_button_disabled')
                    .removeAttr('disabled');
                }
                else
                {
                    $(this)
                    .addClass('_bf_widget_button_disabled')
                    .removeClass('_bf_widget_button')
                    .attr(
                    {
                        disabled: 'disabled'
                    });
                }           
            });
        })
        .appendTo($('._bf_widget_buttons'));        
    },
    
    cannotPost: function()
    {
        _bf.openPanel(75, 300, function()
        {
            _bf.showStateOverlay(_bf.t('Oops, please login!'), 2000, function()
            {
                _bf.closePanel();
            });
        });       
    }
}

_bf_widgets.init();