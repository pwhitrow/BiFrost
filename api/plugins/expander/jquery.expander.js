/*
 * Expander - jQuery Plugin
 * Simple content expander
 *
 * Copyright (c) 2011 - 2010 Paul Whitrow
 *
 * Version: 1.0 (18/11/2011)
 *
 */

(function($) {

    $.fn.expander = function(options) 
    {
        var defaults = {
            expand: this,
            length: 300,
            moreText: "more",
            lessText: "less",
            moreTitle: "Expand or collapse",
            ellipsisText: '&#8230;'
        };
        
        var options = $.extend(defaults, options);  
  
        var c = options.expand;

        if(c.html().length > options.length)
        {
            // check for multiple BR's and break on first

            var parts = c.html().split('<br>');

            var more = $('<span />')
            .css(
            {
                'display': 'inline-block'
            })
            .hide();

            var moreLink = $('<em />').attr(
            {
                'class': '_expander_more_link',
                title: options.moreTitle
            })
            .html(options.moreText + options.ellipsisText)
            .addClass('_expander_collapsed')
            .click(function()
            {
                expander($(this), c, more, options);
            })
            .css(
            {
                opacity: 0.45
            })
            .mouseover(function()
            {
                $(this).stop().animate(
                {
                    opacity: 1
                }, 
                _bf.ani_speed)
            })
            .mouseout(function()
            {
                $(this).stop().animate(
                {
                    opacity: 0.45
                }, 
                _bf.ani_speed)
            })

            if(parts.length > 1)
            {
                for(i = 1; i < parts.length; i++)
                {
                    more.append(parts[i]);
                    $('<br />').appendTo(more);
                }

                c.html(parts[0])
                .append(more)
                .append(moreLink);
            }
        }
    };

    function expander(moreLink, c, more, options)
    {
        more.slideToggle(_bf.ani_speed, function()
        {
            if(moreLink.hasClass('_expander_collapsed'))
            {
                moreLink.html(options.lessText + options.ellipsisText)
                .removeClass('_expander_collapsed')
                .addClass('_expander_expanded');

                more.show();
            }
            else
            {
                moreLink.html(options.moreText + options.ellipsisText)
                .removeClass('_expander_expanded')
                .addClass('_expander_collapsed');

                more.hide();
            }
        });
    }

})(jQuery);