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
                speed: 350,
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
                    'class': '_showbox_close'
                })
                .css(
                {
                    'position': 'absolute',
                    'top': '-20px',
                    'right': '-20px',
                    'height': '20px',
                    'width': '20px',
                    'cursor': 'pointer',
                    'background': 'red'
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
                                
            settings.obj.each(function()
            {
                $(this).click(function(event)
                {
                    create_main();
                    
                    event.preventDefault();
                    
                    var filename = $(this).attr('href');
                    
                    var extension = filename.substr( (filename.lastIndexOf('.') +1) );

                    var port = get_viewport();
                    var canvasWidth = parseInt(port[0]);
                    var canvasHeight = parseInt(port[1]);
                    
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
                                var minRatio = Math.min(canvasWidth / img.width, canvasHeight / img.height);
                                var newImgWidth = minRatio * (img.width / 1.3);
                                var newImgHeight = minRatio * (img.height / 1.3);
                                var newImgX = (canvasWidth - newImgWidth) / 2;
                                var newImgY = (canvasHeight - newImgHeight) / 2;

                                $('._showbox_img').attr(
                                {
                                    'src': $(this).attr('src'),
                                    'height': newImgHeight,
                                    'width': newImgWidth
                                })
                                .load(function()
                                {
                                    $('._showbox_main').css(
                                    {
                                        'position': 'absolute',
                                        'height': newImgHeight,
                                        'width': newImgWidth,                                
                                        'top': newImgY + 'px',
                                        'left': newImgX + 'px'
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
                    
                    if(fileType('video', extension))
                    {
                        var vidHeight = 400;
                        var vidWidth = 500;
                        
                        var minRatio = Math.min(canvasWidth / vidWidth, canvasHeight / vidHeight);
                        var newImgWidth = minRatio * (vidWidth / 1.3);
                        var newImgHeight = minRatio * (vidHeight / 1.3);
                        var newImgX = (canvasWidth - newImgWidth) / 2;
                        var newImgY = (canvasHeight - newImgHeight) / 2;

                        $('._showbox_main').css(
                        {
                            'position': 'absolute',
                            'height': newImgHeight,
                            'width': newImgWidth,                                
                            'top': newImgY + 'px',
                            'left': newImgX + 'px'
                        });

                        var skin = _bf.host + 'api/plugins/player/skins/glow.zip';

                        var s1 = new SWFObject(_bf.host + 'api/plugins/player/player.swf', '_bf_MediaPlayer', newImgWidth, newImgHeight, '9.0.124');
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
