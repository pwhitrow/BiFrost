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
                    'top': '0px',
                    'left': '0px',
                    'bottom': '0px',
                    'right': '0px',
                    'background': 'transparent url(' + _bf.host + 'api/plugins/showbox/bg.png) 0 0 repeat'
                })
                .appendTo($('body'));
            }
            
            
            create_main = function()
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
                    'padding': '5px',
                    'background': '#ddd',
                    '-moz-border-radius': '5px',
                    '-webkit-border-radius': '5px',
                    'border-radius': '5px',
                    '-webkit-box-shadow': '0px 2px 7px rgba(0, 0, 0, 0.54)',
                    '-moz-box-shadow':    '0px 2px 7px rgba(0, 0, 0, 0.54)',
                    'box-shadow':         '0px 2px 7px rgba(0, 0, 0, 0.54)'

                })
                .appendTo($('._showbox'));
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
            
            fileType = function(type, extension)
            {
                if(type == 'image') var tmp = _bf.imagetypes.split(';');
                if(type == 'video') var tmp = _bf.videotypes.split(';');
                
                for(i = 0; i < tmp.length; i++)
                {
                    var ext = tmp[i].split('*.');
                    if(ext[1] == extension)
                    {
                        return true;
                    }
                }
                
                return false;
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
                    
                    var extension = filename.substr( (filename.lastIndexOf('.') +1) );

                    // are we an image?
                    if(fileType('image', extension))
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
                                        $('._showbox').fadeIn(settings.speed);  
                                        add_close();
                                    })
                                });
                            });
                            
                        });
                        img.src = filename;
                    }
                    
                    // are we a video?
                    if(fileType('video', extension))
                    {
                        var box = showBoxSize(500, 400);

                        $('._showbox_main').css(
                        {
                            'position': 'absolute',
                            'height': box['newHeight'],
                            'width': box['newWidth'],                                
                            'top': box['newY'] + 'px',
                            'left': box['newX'] + 'px'
                        });

                        var skin = _bf.host + 'api/plugins/player/skins/glow.zip';

                        var s1 = new SWFObject(_bf.host + 'api/plugins/player/player.swf', '_bf_MediaPlayer', box['newWidth'], box['newHeight'], '9.0.124');
                        s1.addParam('quality', 'best');
                        s1.addParam('allowfullscreen', 'true');
                        s1.addParam('allownetworking', 'all');
                        s1.addParam('allowscriptaccess', 'always');
                        s1.addVariable('enablejs', 'true');
                        s1.addVariable('javascriptid', '_bf_MediaPlayer');
                        s1.addParam('flashvars', 'file=' + filename + '&image=' + _bf.host + 'images/' + _bf.no_image + '&skin=' + skin + '&autostart=true');
                        s1.write('_showbox_main');
                        
                        $('._showbox').fadeIn(settings.speed);   
                        
                        add_close();
                        
                    }
                });
            });

        }
    });
})(jQuery);
