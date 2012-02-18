/*
 * ShowBox - jQuery Plugin
 * Lightbox style media popup
 *
 * Copyright (c) 2011 Paul Whitrow
 *
 * Version: 1.0 (02/12/2011)
 *
 */

(function($)
{
    $.fn.extend(
    {
        showBox: function(options)
        {
            var settings = $.extend(
            {
                path: './',
                obj: this,
                default_img: '',
                speed: 400,
                margin: 20
            }, options);
            
            if(!$('._showbox').length)
            {
                $('<div />').attr(
                {
                    'class': '_showbox'
                })
                .css(
                {
                    'display': 'none',
                    'position': 'fixed',
                    'z-index': 10000,
                    'top': '0px',
                    'left': '0px',
                    'bottom': '0px',
                    'right': '0px',
                    'background': 'transparent url(' + _bf.host + 'api/plugins/showbox/bg.png) 0 0 repeat'
                })
                .appendTo($('body'));

                if(!$('._showbox_loader').length)
                {
                    $('<div />').attr(
                    {
                        'class': '_showbox_loader',
                        'id': '_showbox_loader'
                    })
                    .css(
                    {
                        'margin': '0px 0px 0px -30px',
                        'height': '100%',
                        'width': '100%',
                        'position': 'absolute',
                        'top': '0px',
                        'left': '0px',
                        'overflow':'hidden',
                        'float': 'left',  
                        'padding': '0px',
                        'background': 'transparent url(' + _bf.host + 'api/plugins/showbox/loader.gif) center center no-repeat'
                    })
                    .fadeTo(10, 0.3)
                    .appendTo($('._showbox')); 
                }
                    
            }
            
            
            create_main = function()
            {
                if(!$('._showbox_main').length)
                {
                    $('<div />').attr(
                    {
                        'class': '_showbox_main',
                        'id': '_showbox_main'
                    })
                    .css(
                    {
                        'margin': 'auto',
                        'height': '0px',
                        'width': '0px',
                        'position': 'relative',
                        //'padding': '5px',
                        'background': '#fff',
                        //'-moz-border-radius': '5px',
                        'background-clip': 'padding-box',
                        'background-color': '#000',
                        'border': '10px solid rgba(0, 0, 0, 0.7)',
                        '-webkit-border-radius': '10px',
                        'border-radius': '10px',
                        '-webkit-box-shadow': '0px 2px 7px rgba(0, 0, 0, 0.54)',
                        '-moz-box-shadow':    '0px 2px 7px rgba(0, 0, 0, 0.54)',
                        'box-shadow':         '0px 2px 7px rgba(0, 0, 0, 0.54)',
                        'display': 'none'

                    })
                    .appendTo($('._showbox'));                    
                }
            },
            
            add_close = function()
            {
                $('<dv />').attr(
                {
                    'class': '_showbox_close',
                    'title': _bf.t('Close')
                })
                .css(
                {
                    'position': 'absolute',
                    'top': '-20px',
                    'right': '-20px',
                    'height': '32px',
                    'width': '32px',
                    'cursor': 'pointer',
                    'background': 'transparent url(' + _bf.host + 'api/plugins/showbox/close.png) 0 0 no-repeat'
                })
                .click(function()
                {
                    close_showbox();
                })
                .appendTo($('._showbox_main'));
            },
            
            close_showbox = function()
            {
                $('._showbox_main').remove();
                $('._showbox').fadeOut(settings.speed);
            },
                   
            get_viewport = function() 
            {
                return [
                        $(window).width() - (settings.margin * 2),
                        $(window).height() - (settings.margin * 2),
                        $(document).scrollLeft() + settings.margin,
                        $(document).scrollTop() + settings.margin
                ];
            },
            
            
            showBoxSize = function(W, H)
            {
                var port = get_viewport();
                var canvasWidth = parseInt(port[0]);
                var canvasHeight = parseInt(port[1]);
                    
                var sizes = new Array();
                var minRatio = Math.min(canvasWidth / W, canvasHeight / H);
                sizes['newWidth'] = minRatio * (W / 1.3);
                sizes['newHeight'] = minRatio * (H / 1.3);
                sizes['newX'] = (canvasWidth - sizes['newWidth']) / 2;
                sizes['newY'] = (canvasHeight - sizes['newHeight']) / 2;
                
                return sizes
            },
                                
            settings.obj.each(function()
            {
                $(this).click(function(event)
                {
                    create_main();
                    
                    event.preventDefault();
                    
                    var filename = $(this).attr('href');
                    
                    $('._showbox').fadeIn(settings.speed);
                    
                    // are we an image?
                    if(_bf.mediaType('image', filename))
                    {
                        if(!$('._showbox_img').length)
                        {
                            var img = new Image();

                            $('<img />').attr(
                            {
                                'class': '_showbox_img',
                                'src': '',
                                'height': 0,
                                'width': 0,
                                'alt': ''
                            })
                            .click(function()
                            {
                                close_showbox();
                            })
                            .appendTo($('._showbox_main'))
                            .each(function()
                            {
                                $(img).load(function()
                                {
                                    var box = showBoxSize(img.width, img.height);

                                    $('._showbox_img').attr(
                                    {
                                        'src': $(this).attr('src'),
                                        'height': box['newHeight'],
                                        'width': box['newWidth']
                                    })
                                    .load(function()
                                    {
                                        $('._showbox_main').css(
                                        {
                                            'position': 'absolute',
                                            'height': box['newHeight'],
                                            'width': box['newWidth'],                                
                                            'top': box['newY'] + 'px',
                                            'left': box['newX'] + 'px'
                                        })
                                        .each(function()
                                        {
                                            $('._showbox_main').fadeIn(settings.speed);  
                                            add_close();
                                        })
                                    });
                                });

                            });
                            img.src = filename;
                            
                        }
                    }
                    
                    // are we a video?
                    if(_bf.mediaType('video', filename))
                    {
                        var box = showBoxSize(500, 400);

                        $('._showbox_main').css(
                        {
                            'position': 'absolute',
                            'height': box['newHeight'],
                            'width': box['newWidth'],                                
                            'top': box['newY'] + 'px',
                            'left': box['newX'] + 'px'
                        })
                        .each(function()
                        {
                            $('<div />').attr(
                            {
                                'id': '_showbox_player',
                                'class': '_showbox_player'
                            })
                            .appendTo($(this));
                        });

                        // http://code.google.com/p/swfobject/wiki/documentation
                        var flashvars = {
                            file: filename,
                            image: _bf.host + 'images/video.png',
                            skin: _bf.host + 'api/plugins/player/skins/glow.zip'
                        };
                        var params = {
                            quality: 'best',
                            play: true,
                            allowfullscreen: true,
                            allownetworking: 'all',
                            allowscriptaccess: 'always'
                        };
                        var attributes = {
                            enablejs: true,
                            javascriptid: '_bf_MediaPlayer'
                        };
                        
                        swfobject.embedSWF(_bf.host + 'api/plugins/player/player.swf', "_showbox_player", box['newWidth'], box['newHeight'], "9.0.0", _bf.host + 'api/plugins/player/expressInstall.swf', flashvars, params, attributes);
                        
                        $('._showbox_main').fadeIn(settings.speed);   
                        
                        add_close();
                        
                    }
                });
            });
            
            $(document).keyup(function(e) 
            {
              if (e.keyCode == 27) 
              { 
                  close_showbox(); 
              }
            });
        }
    });
})(jQuery);
