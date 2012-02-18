/*
 * Socials - jQuery Plugin
 * Simple social contsnt share
 *
 * Copyright (c) 2011 Paul Whitrow
 *
 * Version: 1.0 (27/11/2011)
 *
 */

(function($)
{
    var socials = $.fn.extend(
    {
        socials: function(options)
        {
            var settings = $.extend(
            {
                path: './',
                obj: this,
                title: document.title,
                href: $(location).attr('href'),
                share: []
            }, options);
            
            settings.share = [
            {media: 'Email', link: 'mailto:?subject=' + escape(settings.title) + '&body=' + escape(settings.href)},
            {media: 'Facebook', link: 'http://www.facebook.com/share.php?u=' + escape(settings.href) + '&amp;title=' + settings.title},
            {media: 'Twitter', link: 'http://www.twitter.com/home?status=' + escape(settings.href) + '&amp;status=' + escape(settings.href)},
            {media: 'Delicious', link: 'http://del.icio.us/post?url=' + escape(settings.href) + '&amp;title=' + settings.title},
            {media: 'Digg', link: 'http://digg.com/submit?phase=2&amp;url=' + escape(settings.href) + '&amp;title=' + settings.title},
            {media: 'Reddit', link: 'http://reddit.com/submit?url=' + escape(settings.href) + '&amp;title=' + settings.title},
            {media: 'NewsVine', link: 'http://www.newsvine.com/_tools/seed&amp;save?u=' + escape(settings.href) + '&amp;title=' + settings.title},
            {media: 'StumbleUpon', link: 'http://www.stumbleupon.com/submit?url=' + escape(settings.href) + '&amp;title=' + settings.title}
            ];

            $('<ul />').attr(
            {
                'class': '_bf_social_bookmarks'
            })
            .appendTo(settings.obj)
            .each(function()
            {
                $('<li />').attr(
                {
                    'class': '_bf_social_tracks'
                })
                .html('<em><a href="'+settings.href+'" rel="bookmark" title="'+_bf.t('Permanant link to post')+'">Permalink</a></em> : <em><a href="'+settings.href+'" rel="trackback" title="'+_bf.t('Trackback link to post')+'">Trackback</a></em>')
                .appendTo($(this));
                
                for(i = 0; i < settings.share.length; i++)
                {
                    $('<li />').attr(
                    {
                        'class': '_bf_social_bookmark'
                    })
                    .appendTo($(this))
                    .each(function()
                    {
                        var link = settings.share[i].link;
                        
                        $('<a />').attr(
                        {
                            'class': '_bf_social_bookmark_link',
                            href: settings.share[i].link,
                            title: _bf.t('Share with') + ' ' + settings.share[i].media
                        })
                        .click(function(event)
                        {
                            event.preventDefault();
                            
                            var h = 500, w = 500;
                            
                            var centeredX, centeredY;
                            
                            if ($.browser.msie) {//hacked together for IE browsers
                                    centeredY = (window.screenTop - 120) + ((((document.documentElement.clientHeight + 120)/2) - (h/2)));
                                    centeredX = window.screenLeft + ((((document.body.offsetWidth + 20)/2) - (w/2)));
                            }else{
                                    centeredY = window.screenY + (((window.outerHeight/2) - (h/2)));
                                    centeredX = window.screenX + (((window.outerWidth/2) - (w/2)));
                            }
                            
                            window.open(link, '_bf_social', 'menubar=0, toolbar=0, status=0, location=0, directories=0, resizable=1, scrollbars=auto, height=' + h + ', width=' + w + ', top=' + centeredY + ', left=' + centeredX).focus();
                        })
                        .appendTo($(this))
                        .each(function()
                        {
                            socials.createImg(settings, $(this));
                        });
                    });
                }
            });            
        },
        
        createImg: function(settings, obj)
        {
            $('<div />').attr(
            {
                'class': '_bf_social_bookmark_image _bf_social_bookmark_image_'+settings.share[i].media.toLowerCase()
            })
            .css(
            {
                opacity: 0.15
            })
            .appendTo(obj)
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
                    opacity: 0.15
                }, 
                _bf.ani_speed)
            });            
        },
        
        addBookmark: function(settings)
        {
            if (document.all)
            {
                window.external.AddFavorite(settings.href, settings.title)
            }
            else if ( window.sidebar ) 
            {
                window.sidebar.addPanel(settings.title, settings.href, "");
            }
        }

    });
})(jQuery);
