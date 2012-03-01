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
                    'background': 'transparent url(' + _bf.host + 'api/plugins/showbox/overlay.png) 0 0 repeat'
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
                        'padding': '2px',
                        'background': '#fff',
                        'background-clip': 'padding-box',
                        'background-color': '#000',
                        'border': '10px solid rgba(255, 255, 255, 0.28)',
                        '-webkit-border-radius': '10px',
                        '-moz-border-radius': '10px',
                        'border-radius': '10px',
                        '-webkit-box-shadow': '0px 0px 30px #000',
                        '-moz-box-shadow':    '0px 0px 30px #000',
                        'box-shadow':         '0px 0px 30px #000',
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
                    'top': '-30px',
                    'right': '-30px',
                    'height': '42px',
                    'width': '40px',
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
            
            create_controls = function(collection)
            {
                var collection = collection
                var i = 0;
                
                var controls = $('<ul />').attr(
                {
                    'class': '_showbox_control'
                })
                .css(
                {
                    'margin': '0px',
                    'width': '100%',
                    'position': 'absolute',
                    'bottom': '-30px',
                    'left': '0px',
                    'list-style': 'none',  
                    'padding': '0px 0px 0px 0px'
                })
                .appendTo($('._showbox_main'))
                .each(function()
                {
                    for(i = 0; i < collection.length; i++)
                    {
                        $('<li />').attr(
                        {
                            'class': '_showbox_item'
                        })
                        .css(
                        {
                            'margin': '0px 0px 0px 0px',
                            'height': '40px',
                            'width': '40px',
                            'display': 'inline',
                            'overflow':'hidden',
                            'list-style': 'none',   
                            'padding': '0px 0px 0px 0px',
                            'float': 'left',
                            'font': 'bold 16px Arial',
                            'color': '#FFF',
                            'text-align': 'center',
                            'line-height': '32px',
                            'cursor': 'pointer',
                            'background': 'transparent url(' + _bf.host + 'api/plugins/showbox/blank.png) 2px 0px no-repeat'
                        })
                        .html(i + 1)
                        .click(function()
                        {
                            console.log(collection[i]);
                        })
                        .appendTo($(this));
                    }                    
                });                
            },
                                
            settings.obj.each(function()
            {
                $(this).click(function(event)
                {
                    create_main();
                    
                    event.preventDefault();
                    
                    var filename = $(this).attr('href');
                    
                    $('._showbox').fadeIn(settings.speed);
                    
                    var collection = $(this).parent().find('a');
                    
                    if(collection.length > 1)
                    {
                        create_controls(collection);
                    }
                    
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
                            $('<a />').attr(
                            {
                                'id': '_showbox_player',
                                'class': '_showbox_player',
                                'href': filename
                            })
                            .css(
                            {
                                'height': box['newHeight'] + 'px',
                                'width': box['newWidth'] + 'px'
                            })
                            .appendTo($(this))
                            .each(function()
                            {
                                flowplayer("_showbox_player", _bf.host + "api/plugins/showbox/flowplayer-3.2.7.swf");

                                $('._showbox_main').fadeIn(settings.speed);   

                                add_close();
                        
                            });
                        });
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
