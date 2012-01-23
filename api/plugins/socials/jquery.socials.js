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
    $.fn.extend(
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
            {media: 'Facebook', link: 'http://www.facebook.com/share.php?u=' + escape(settings.href) + '&amp;title=' + settings.title, 'img': 'facebook.png'},
            {media: 'Twitter', link: 'http://www.twitter.com/home?status=' + escape(settings.href) + '&amp;status=' + escape(settings.href), 'img': 'twitter.png'},
            {media: 'Delicious', link: 'http://del.icio.us/post?url=' + escape(settings.href) + '&amp;title=' + settings.title, 'img': 'delicious.png'},
            {media: 'Digg', link: 'http://digg.com/submit?phase=2&amp;url=' + escape(settings.href) + '&amp;title=' + settings.title, 'img': 'digg.png'},
            {media: 'Reddit', link: 'http://reddit.com/submit?url=' + escape(settings.href) + '&amp;title=' + settings.title, 'img': 'reddit.png'},
            {media: 'NewsVine', link: 'http://www.newsvine.com/_tools/seed&amp;save?u=' + escape(settings.href) + '&amp;title=' + settings.title, 'img': 'newsvine.png'},
            {media: 'StumbleUpon', link: 'http://www.stumbleupon.com/submit?url=' + escape(settings.href) + '&amp;title=' + settings.title, 'img': 'stumbleupon.png'}
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
                    'class': '_bf_social_bookmark_text'
                })
                .html(_bf.t('Share') + ':')
                .appendTo($(this))
                
                $('<li />').attr(
                {
                    'class': '_bf_social_bookmark _bf_social_bookmarks_likes'
                })
                .each(function()
                {
//                    $('<span />').attr(
//                    {
//                        'class': '_bf_social_bookmark'
//                    })
//                    .each(function()
//                    {
////                $(this).append('<script src="//platform.twitter.com/widgets.js" type="text/javascript"></script><div><a href="https://twitter.com/share?url=' + _bf.host + '" class="twitter-share-button">Tweet</a></div>');
////                $(this).append("<span  class='st_linkedin_hcount' displayText='LinkedIn'></span><span  class='st_twitter_hcount' displayText='Tweet'></span><span  class='st_facebook_hcount' displayText='Facebook'></span>");
////                $(this).append('<script type="text/javascript">var switchTo5x=true;</script><script type="text/javascript" src="http://w.sharethis.com/button/buttons.js"></script><script type="text/javascript">stLight.options({publisher:\'4a2145e0-6211-42ee-b46f-2072b75cdd6a\'});</script>');
//
//                        // Facebook
//                        $(this).append('<iframe src="http://www.facebook.com/plugins/like.php?href=' + _bf.host + '&amp;layout=button_count" scrolling="no" frameborder="0" style="border:none; width:90px; height:25px"></iframe>');
//                    })
//                    .appendTo($(this));
//                    
//                     $('<span />').attr(
//                    {
//                        'class': '_bf_social_bookmark'
//                    })
//                    .each(function()
//                    {
//                        // Twitter       
//                        $(this).append('<script src="//platform.twitter.com/widgets.js" type="text/javascript"></script><div><a href="https://twitter.com/share?url=' + _bf.host + '" class="twitter-share-button">Tweet</a></div>');
//                    })
//                    .appendTo($(this));
//
               })
               //.appendTo($(this));
                

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
                            $('<img />').attr(
                            {
                                'class': '_bf_social_bookmark_image',
                                alt: _bf.t('Social Share'),
                                height: 25,
                                width: 25,
                                border: 0,
                                src: settings.path + 'images/bare/' + settings.share[i].img
                            })
                            .css(
                            {
                                opacity: 0.15
                            })
                            .appendTo($(this))
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
                        });
                    });
                }
            });
        }
    });
})(jQuery);
