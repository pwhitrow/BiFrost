/*
    Application:    BiFrost
    Document   :    _bf.js
    Created on :    27-Oct-2011, 21:37:22
    Author     :    Paul Whitrow
    Description:    Main JS include
                    Dynamically generate just about everything
                    so we can keep the markup clean and not intrude
                    on client site.
*/

// Change the below if you're on local
//var _bf_host = 'http://localhost:56870/';
var _bf_host = 'http://bifrostplatform.co.uk/';

// do we need to load jQuery?
if((typeof $ != 'function') || (parseInt($().jquery) < 1.7))
{
    _bf_loadscript(_bf_host + 'api/libs/jquery.1.7.min.js');
}

// insert a script
function _bf_loadscript(src)
{
    if(typeof $ != 'undefined')
    {
        // loop through loaded scripts
        $('script').each(function()
        {
            // force script to reload by removing the old reference
            if($(this).attr('src') == src)
            {
                $(this).remove();
            }
        })        
    }
                    
    var head = document.getElementsByTagName('head').item(0);
    
    if(src.indexOf('.js') >= 0)
    {
        if(_bf_scriptrequired('script', src))
        {
            var script = document.createElement('script');
            script.src = src;
            script.defer = 'defer';
            script.type = 'text/javascript';
            void(head.appendChild(script));
        }        
    }
    
    if(src.indexOf('.css') >= 0)
    {
        if(_bf_scriptrequired('link', src))
        {
            var css = document.createElement('link');
            css.href = src;
            css.rel = 'stylesheet';
            css.defer = 'defer';
            void(head.appendChild(css));
        }        
    }
}

function _bf_basename(path) 
{
    return path.replace(/\\/g,'/').replace( /.*\//, '' );
}


function _bf_scriptrequired(type, src)
{
    var scripts = document.getElementsByTagName(type);
    var needScript = true;
    
    // check to see if src is already included
    if(scripts.length)
    {
        for(i = 0; i < scripts.length; i++)
        {
            if(typeof scripts[i].src != 'undefined')
            {
                if(_bf_basename(scripts[i].src) == _bf_basename(src))
                {
                   needScript = false;
                }
            }
        }
    }    
    
    return needScript;
}

// pre load required scripts
function _bf_loadScripts(callback) 
{
    // load BiFrost required files and plugins
    var scripts = [
        'css/_bf.css',
        'css/_bf_items.css',
        'api/plugins/player/swfobject.js',
        'api/plugins/expander/jquery.expander.js',
        'api/plugins/socials/jquery.socials.js',
        'api/plugins/socials/jquery.socials.css',
        'api/plugins/showbox/jquery.showbox.js',
        'api/plugins/multiselect/jquery.multiselect.js',
        'api/plugins/uploadify/jquery.uploadify.v2.1.4.js',
        'api/plugins/player/jwplayer.js',
        'api/plugins/timeago/jquery.timeago.js',
        'api/plugins/raty/js/jquery.raty.min.js'
    ];
    
  
    for(var itemno = 0; itemno < scripts.length; itemno++)
    {
        _bf_loadscript(_bf_host + scripts[itemno]);
    }
    
    if(typeof callback == 'function')
    {
        callback();
    }    
}

// start!
function _bf_begin()
{
    if(typeof $ == 'function') 
    {
        // jQuery loaded, let's go...        
        _bf_loadScripts(function()
        {
            _bf_go();
        });
    } 
    else 
    {
        // wait for jQuery to load
        window.setTimeout(_bf_begin, 100);
    }
}

// loaded, let's go!
function _bf_go()
{
    $(function()
    {
        // create namespace
        _bf = {

            target: BiFrost.target,
            host: _bf_host,
            api_key: BiFrost.api_key,
            relation: BiFrost.relation,
            api_token: false,
            appname: '',
            uploads: false,
            can_create_tags: true,
            no_image: 'noimage.jpg',
            vid_image: 'video.png',
            maxfilesize: 10485760, // 10MB,
            imagetypes: '*.jpeg;*.jpg;*.gif;*.png;',
            videotypes: '*.flv;',
            filetypes: '',
            bfme: false,
            state: false,
            state_panel: false,
            state_width_default: 170,
            state_height_default: 42,
            state_actions: false,
            custom_css: false,
            ani_speed: 200,
            msg_display_time: 3000,
            content_character_limit: 300,
            current_widget: 'reviews',
            timer: 0,
            
            confirmReg: function()
            {
                var urlParams = decodeURI( window.location.search.substring(1) );
                if(urlParams.indexOf('verifynewsuser') >= 0)
                {
                    var str = urlParams.split('=');
                    
                    _bf.post(
                    {
                        'action': 'verifynewsuser',
                        'token': str[1]
                    });
                }
            },

            // initialise
            init: function()
            {
                //firstly, are we confirming a registration?
                _bf.confirmReg();
                
                _bf.filetypes = _bf.imagetypes + _bf.videotypes;
                
                // get the token if set
                if(_bf.cookie('api_token'))
                {
                    _bf.api_token = _bf.cookie('api_token');
                }
                
                // create widgets
                $('<div />').attr(
                {
                    'class': '_bf_widgets',
                    rel: _bf.relation
                })
                .appendTo(($('#' + _bf.target).length ? $('#' + _bf.target) : $('body')))
                .each(function()
                {
                    $('<div />').attr(
                    {
                        'class': '_bf_widgets_holder'
                    })
                    .appendTo($(this).parent())
                    .each(function()
                    {
                        $('<div />').attr(
                        {
                            'class': '_bf_widgets_controller'
                        })
                        .appendTo($(this))
                        .each(function()
                        {
                            // create the widgets
                            $('<div />').attr(
                            {
                                'class': '_bf_reviews',
                                rel: _bf.relation
                            })
                            .appendTo($('._bf_widgets_holder'))
                            .each(function()
                            {
                                _bf_loadscript(_bf.host + 'api/views/itemreviews.js');
                            });

                            $('<div />').attr(
                            {
                                'class': '_bf_discussions',
                                rel: _bf.relation
                            })
                            .appendTo($('._bf_widgets_holder'))
                            .each(function()
                            {
                                _bf_loadscript(_bf.host + 'api/views/itemdiscussions.js');
                            });    
                            
                            _bf.createStatePanel();
                        });

                    });
                });

            },
            
            createStatePanel: function()
            {
                if(!$('._bf_widgets_holder').length)
                {
                    setTimeout(function()
                    {
                        _bf.createStatePanel()
                    }, 100);
                }
                else
                {
                     // create main container if it doesn't exists
                    if(!$('._bf_me').length)
                    {
                        _bf.bfme = $('<div />').attr(
                        {
                            'class': '_bf_me'
                        })
                        
                        if(typeof BiFrost.position != 'undefined')
                        {
                            _bf.bfme.appendTo(document.body);
                        }
                        else
                        {
                            _bf.bfme.css(
                            {
                                'position': 'absolute',
                                'right': '0px',
                                'top': '165px',
                                'z-index': '100'
                            })
                            .prependTo($('._bf_widgets_holder'));
                        }
                    }
                    else
                    {
                        _bf.bfme = $('._bf_me');
                        _bf.custom_css = {position:'relative', top:'0px', left:'0px'};
                    }

                    // create the main element
                    _bf.state_panel = $('<div />').attr(
                    {
                        'class': '_bf_state'
                    })
                    .appendTo(_bf.bfme)
                    .hide();                         

                    // cement state's position in document
                    _bf.statePosition($('._bf_state'));

                     // check the login state
                    _bf.getState(function()
                    {                    
                        // check if we are logged into facebbok
                         _bf_loadscript(_bf.host + 'api/plugins/oauths/facebook.js');     

                        // create the state actions
                        _bf.showStateActions();
                    });

                    
                }
            },
            
            widgetSwitch: function(type)
            {
                if(type == 'reviews')
                {
                    $('._bf_itemdiscussions').fadeOut(_bf.ani_speed, function()
                    {
                        $('._bf_discussions_control').removeClass('active');
                        $('._bf_reviews_control').addClass('active');
                        $('._bf_itemreviews').fadeIn(_bf.ani_speed);
                    });                    
                }    
                if(type == 'discussions')
                {
                    $('._bf_itemreviews').fadeOut(_bf.ani_speed, function()
                    {
                        $('._bf_discussions_control').addClass('active');
                        $('._bf_reviews_control').removeClass('active');
                        $('._bf_itemdiscussions').fadeIn(_bf.ani_speed);
                    });
                }    
                
                $('._bf_item'+type+'_header').removeClass('stick');
                _bf.current_widget = type;
            },

            widgetButton: function(type, txt1, txt2, where)
            {
                $('<div />').attr(
                {
                    'class': '_bf_widget_button_holder',
                    title: _bf.t(txt2)
                })
                .html(function()
                {

                    $('<button />').attr(
                    {
                        'class': '_bf_widget_butts _bf_widget_button _bf_widget_' + type
                    })
                    .html(_bf.t(txt1))
                    .appendTo($(this))
                    .click(function()
                    {
                        if(_bf.loggedIn())
                        {
                            _bf.openPanel(type, function()
                            {
                                $('._bf_dashboard').remove();

                                _bf.getForm(
                                {
                                    form: type,
                                    parentid: _bf.relation
                                });
                            });
                        }
                        else
                        {
                            _bf.cannotPost();
                        }
                    })
                    .each(function()
                    {
                        if(!_bf.loggedIn())
                        {
                            $(this)
                            .removeClass('_bf_widget_button')
                            .addClass('_bf_widget_button_disabled')
                        }
                    });
                })
                .appendTo(where)
                .each(function()
                {
                });        
            },
            
            widgetLoading: function(type, callback)
            {
                if(type == 'reviews')
                {
                    if(!$('._bf_reviews_fetching').length)
                    {
                        $('<div />').attr(
                        {
                            'class': '_bf_reviews_fetching'
                        })
                        .html(_bf.t('Fetching reviews') + '...')
                        .css(
                        {

                        })
                        .appendTo($('._bf_widgets_holder'))
                        .each(function()
                        {
                            _bf_itemreviews.getReviews();                
                        });
                    }
                    else
                    {
                        $('._bf_reviews_fetching')
                        .show()
                        .each(function()
                        {
                            _bf_itemreviews.getReviews();                
                        });
                    }        
                }
                
                if(type == 'discussions')
                {
                    if(!$('._bf_discussions_fetching').length)
                    {
                        $('<div />').attr(
                        {
                            'class': '_bf_discussions_fetching'
                        })
                        .html(_bf.t('Fetching discussions') + '...')
                        .appendTo($('._bf_widgets_holder'))
                        .each(function()
                        {
                            _bf_itemdiscussions.getDiscussions();                
                        });
                    }
                    else
                    {
                        $('._bf_discussions_fetching')
                        .show()
                        .each(function()
                        {
                            _bf_itemdiscussions.getDiscussions();                
                        });
                    }
                }
                
                // do we have a callback?
                if($.isFunction(callback))
                {
                    callback.call(this);
                }
            },
    
            widgetLoaded: function(type)
            {
                if(type == 'reviews')
                {
                    $('._bf_reviews_fetching').hide();
                }
                
                if(type == 'discussions')
                {
                    $('._bf_discussions_fetching').hide();
                }
                
            },
            
            sticky: function(widget)
            {
                var window_top = $(window).scrollTop() +1;
                
                var target = $('._bf_item'+widget);
                
                if(!target.length) return;
                    
                var div_top = target.offset().top;
                
                if (window_top > div_top)
                {
                    $('._bf_item'+widget+'_header').addClass('stick')
                    
                    if(typeof BiFrost.position == 'undefined')
                    {
                        $('._bf_me').addClass('stick');
//                        $('._bf_me').css(
//                        {
//                            'right': '-' + (_bf.state_width_default + 5) + 'px',
//                            'top': '0px'
//                        })
//                        .appendTo($('._bf_item'+widget+'_header'));
                    }
                }
                else
                {
                    $('._bf_item'+widget+'_header').removeClass('stick');
                    
                    if(typeof BiFrost.position == 'undefined')
                    {
                        $('._bf_me').removeClass('stick');
//                        $('._bf_me').css(
//                        {
//                            'right': '0px',
//                            'top': '165px'
//                        })
//                        .prependTo($('._bf_widgets_holder'));
                    }
                }                                    
            },
            
            buttonState: function()
            {
                $('._bf_widget_butts').each(function()
                {
                    if(_bf.loggedIn())
                    {
                        $(this)
                        .addClass('_bf_widget_button')
                        .removeClass('_bf_widget_button_disabled');
                    }
                    else
                    {
                        $(this)
                        .removeClass('_bf_widget_button')
                        .addClass('_bf_widget_button_disabled');
                    }           
                });                
            },

            cannotPost: function()
            {
                _bf.openPanel('login', function()
                {
                    _bf.state_action.html(_bf.t('Close'))
                    .attr('title', _bf.t('Click to close'));

                    _bf.getForm(
                    {
                        form: 'login'
                    },
                        _bf.showStateOverlay(_bf.t('Please login or register'), 2000)
                    );
                });
                
            },
            
            // currently a placeholder for translating text
            t: function(txt)
            {
                return txt;
            },

            // TO DO! Translate via API?
            tx: function(txt)
            {
                $.post(_bf.host + 'api/_bf_api.php',
                {
                    action: 'translate',
                    str: txt
                },
                function(data)
                {
                    var data = $.parseJSON(data);
                    return data.tx;
                });
            },

            // clean up elements
            cleanUp: function(el, callback)
            {
                if(el.length)
                {
                    el.remove();
                }   
                
                // do we have a callback?
                if($.isFunction(callback))
                {
                    callback.call(this);
                }
            },

            paginator: function(obj, holder)
            {
                if(typeof obj.recordqty == 'undefined')
                {
                    obj.recordqty = 0;
                }
                if(typeof obj.pagenum == 'undefined')
                {
                    obj.pagenum = 1;
                }

                $('<ul />').attr(
                {
                    'class': '_bf_items_paginator_top'
                })
                .prependTo(holder)
                .each(function()
                {
                    var qty = Math.ceil(obj.recordqty / obj.limitqty);
                    
                    // don't show paginator for just one page!
                    if(qty > 1)
                    {
                        for(i = 1; i < qty + 1; i++)
                        {
                            var el = $('<li />').attr(
                            {
                                'class': obj.pagenum == i ? '_bf_items_pager_disabled' : '_bf_items_pager',
                                'rel': (i > 1 ? obj.limitqty * (i - 1) : 0),
                                'title': _bf.t('Go to page') + ' ' + i + ' ' + _bf.t('of') + ' ' + qty
                            })
                            .html(i)
                            .appendTo($(this));

                            if(obj.pagenum != i)
                            {
                                el.click(function()
                                {
                                    holder.css(
                                    {
                                        'opacity': 0.3
                                    });

                                    var x = parseInt($(this).html());

                                    obj.pagenum = x;

                                    obj.limitfrom = $(this).attr('rel');

                                    if(holder.hasClass('_bf_itemreviews'))
                                    {
                                        obj.getReviews();
                                    }
                                    if(holder.hasClass('_bf_itemdiscussions'))
                                    {
                                        obj.getDiscussions();
                                    }
                                });
                            }
                        }
                    }
                })
                .clone(true)
                .removeClass('_bf_items_paginator_top')
                .addClass('_bf_items_paginator_bottom')
                .appendTo(holder);
            },
    
            // where should we put the state bar?
            statePosition: function(el)
            {
                // has the user specified a position?
                if(typeof BiFrost.position != 'undefined')
                {
                    el.addClass('_bf_' + BiFrost.position);
                }
                else
                // if not, apply our default
                {
                    //el.addClass('_bf_topright');
                }

                // if there is a custom position in the document
                if(_bf.custom_css)
                {
                    el.css(_bf.custom_css);
                }

            },

            // hide the state forms multi select
            hideMultiSelect: function()
            {
                // hide multi select if it's up
                if($('._bf_multiselect_holder').length)
                {
                    $('._bf_multiselect_holder').hide();
                }
            },

            // somewhere to show the messages!
            showStateOverlay: function(msg, close, callback, keepMultiSelect)
            {
                // clean up
                //_bf.cleanUp($('._bf_state_overlay'));

                // sometimes we need to keep the multi select tag box open
                // we do that by passing true to the argument and bypassing this switch
                if(typeof keepMultiSelect == 'undefined')
                {
                    _bf.hideMultiSelect();
                }

                if(!$('._bf_state_overlay').length)
                {
                    //create generic state overlay
                    var overlay = $('<div />').attr(
                    {
                        'class': '_bf_state_overlay'
                    })
                    .appendTo(_bf.state_panel)
                    .addClass('_bf_state')
                    .css(
                    {
                        height: $('._bf_state').height() + 'px',
                        width: $('._bf_state').width() + 'px'
                    })
                    .each(function()
                    {
                        // create the message element
                        $('<div />').attr(
                        {
                            'class': '_bf_state_overlay_msg'
                        })
                        .html(msg)
                        .appendTo($(this));                       
                    })
                    .fadeIn(_bf.ani_speed);
                    
                }
                else
                {
                    $('._bf_state_overlay')
                    .css(
                    {
                        height: $('._bf_state').height() + 'px',
                        width: $('._bf_state').width() + 'px'
                    })
                    .each(function()
                    {
                        $('._bf_state_overlay_msg')
                        .html(msg)
                    })
                    .fadeIn(_bf.ani_speed);
                }

                // cement overlay's position in document
                _bf.statePosition($('._bf_state_overlay'));


                // set a default time for display if not passed
                if(!close)
                {
                    close = _bf.msg_display_time;
                }

                if(close == 'false')
                {
                    // do we have a callback?
                    if($.isFunction(callback))
                    {
                        callback.call(this);
                    }
                }
                else
                {
                    // self close after timeout
                    _bf.timer = setTimeout(function()
                    {
                        // do we have a callback?
                        if($.isFunction(callback))
                        {
                            callback.call(this);
                        }

                        _bf.hideStateOverlay();

                    },close);
                }
            },

            // remove the state overlay message
            hideStateOverlay: function(callback)
            {
                clearTimeout(_bf.timer);
                
                $('._bf_state_overlay')
                .html('')
                .fadeOut(_bf.ani_speed,
                function()
                {
                    $('._bf_state_overlay').remove();

                     if($.isFunction(callback))
                     {
                        callback.call(this);
                     }                

                });
            },

            // get the current state
            getState: function(callback)
            {
                var params = {
                    action: 'getstate'
                }

                _bf.post(params);

                if($.isFunction(callback))
                {
                   callback.call(this);
                }
            },

            // open the state panel
            openPanel: function(state, callback)
            {
                var H,W;
                
                if(state == 'login')
                {
                    H = 207;
                    W = 440;
                }
                if(state == 'review')
                {
                    H = 380;
                    W = 593;
                }
                if(state == 'discuss')
                {
                    H = 298;
                    W = 556;
                }
                if(state == 'comment')
                {
                    H = 298;
                    W = 556;
                }
                if(state == 'dashboard')
                {
                    H = 404;
                    W = 600;
                }
                if(state == 'register')
                {
                    H = 374;
                    W = 440;
                }
                if(state == 'forgottenpassword')
                {
                    H = 213;
                    W = 440;
                }
                _bf.hideSocialAuthenticators();
                
                _bf.removeForms();

                _bf.state_panel
                .removeClass('_bf_state_closed')
                .animate(
                {
                    height: H + 'px',
                    width: W + 'px'
                }, _bf.ani_speed,
                function()
                {
                     if($.isFunction(callback))
                     {
                        callback.call(this);
                     }                
                });
            },

            // close the state panel
            closePanel: function(callback)
            {
                _bf.removeForms();
                
                _bf.hideSocialAuthenticators();
                
                _bf.cleanUp($('._bf_dashboard'));

                _bf.hideStateOverlay();

                _bf.resizePanel(_bf.state_width_default, _bf.state_height_default);

                _bf.state_panel.addClass('_bf_state_closed');
                
                if($.isFunction(callback))
                {
                    callback.call(this);
                }

            },

            // resize the state panel
            resizePanel: function(width, height, callback)
            {
                _bf.state_panel.animate(
                {
                    height: height + 'px',
                    width: width + 'px'
                }, {duration: _bf.ani_speed, queue: false});

                $('._bf_state_overlay').animate(
                {
                    height: height + 'px',
                    width: width + 'px'
                }, {duration: _bf.ani_speed, queue: false});          

                if($.isFunction(callback))
                {
                    callback.call(this);
                }
            },

            // are we logged into the app?
            loggedIn: function()
            {
                if(!_bf.cookie('_bf_state') || _bf.cookie('_bf_state') == false || _bf.cookie('_bf_state') == 'false')
                {
                    return false
                }
                else
                {
                    return true;
                }
            },

            // what actions should we show, depending on state
            showStateActions: function()
            {
                _bf.hideSocialAuthenticators();

                _bf.cleanUp($('._bf_state_actions'), function()
                {
                    _bf.state_actions = $('<ul />')
                    .attr(
                    {
                        'class': '_bf_state_actions'
                    })
                    .appendTo(_bf.state_panel);

                    // what state are we in?
                    if(!_bf.loggedIn())
                    {
                        var login_button_text = (typeof BiFrost.panel_text != 'undefined' ? BiFrost.panel_text : _bf.t('Login : Register'));
                        
                        _bf.state_action = $('<li />')
                        .hide()                        
                        .attr(
                        {
                            'class': '_bf_state_action _bf_button _bf_force_button_pos',
                            title: _bf.t('Click to open')
                        })
                        .appendTo(_bf.state_actions)                        
                        .toggle(
                        function()
                        {
                            _bf.openPanel('login', function()
                            {
                                _bf.state_action
                                .removeClass('_bf_button')
                                .removeClass('_bf_force_button_pos')
                                .html(_bf.t('Close'))
                                .attr('title', _bf.t('Click to close'));

                                _bf.getForm({form: 'login'});
                            });
                        },
                        function()
                        {
                            _bf.closePanel(function()
                            {
                                _bf.state_action
                                .addClass('_bf_button')
                                .addClass('_bf_force_button_pos')
                                .html(login_button_text)
                                .attr('title', _bf.t('Click to open'));
                            });
                        })
                        .each(function()
                        {
                            $(this).html(login_button_text);
                            
                            _bf.resizePanel(_bf.state_width_default, _bf.state_height_default, function()
                            {
                               _bf.state_actions.fadeIn(_bf.ani_speed);
                                _bf.state_panel
                                    .css(
                                    {
                                        width: _bf.state_width_default,
                                        height: _bf.state_height_default + 'px'
                                    })
                                    .slideDown(_bf.ani_speed)
                                    .addClass('_bf_state_closed');
                            });
                            
                            
                        });
                    }
                    else
                    {
                        var dashboard = $('<li />')
                        .html(_bf.t('Dashboard'))
                        .attr(
                        {
                            'class': '_bf_state_action',
                            'title': _bf.t('Click to open your dashboard')
                        })
                        .appendTo(_bf.state_actions)
                        .click(function()
                        {
                            $(this).fadeOut(_bf.ani_speed);

                            _bf.openPanel('dashboard', function()
                            {
                                // if we don't have a close button,
                                // create one and add it to the state actions
                                if(!$('._bf_closer').length)
                                {
                                    var closedashboard = $('<li />')
                                    .html(_bf.t('Close'))
                                    .attr(
                                    {
                                        'class': '_bf_state_action _bf_closer',
                                        'title': _bf.t('Click to close')
                                    })
                                    .click(function()
                                    {
                                        $(this).remove();

                                        _bf.closePanel(function()
                                        {
                                            _bf.resizePanel(_bf.state_width_default, _bf.state_height_default);

                                            dashboard.fadeIn(_bf.ani_speed);
                                        });
                                    })
                                    .prependTo(_bf.state_actions);
                                }
                                // show the dashboard
                                _bf.getForm({form: 'dashboard'});
                            });
                        })
                        .each(function()
                        {
                            var logout = $('<li />')
                            .html(_bf.t('Logout'))
                            .attr(
                            {
                                'class': '_bf_state_action',
                                'title': _bf.t('Click to logout')
                            })
                            .appendTo(_bf.state_actions)
                            .click(function()
                            {
                                _bf.logout(function()
                                {
                                    _bf.closePanel(function()
                                    {
                                        _bf.hideStateOverlay();
                                    });
                                });
                            })
                            .each(function()
                            {
                                _bf.closePanel(function()
                                {
                                    _bf.resizePanel(_bf.state_width_default, _bf.state_height_default, function()
                                    {
                                        _bf.state_actions.fadeIn(_bf.ani_speed);
                                        _bf.state_panel
                                        .css(
                                        {
                                            width: _bf.state_width_default,
                                            height: _bf.state_height_default + 'px'
                                        })
                                        .slideDown(_bf.ani_speed)
                                        .each(function()
                                        {
                                            _bf.hideStateOverlay();
                                        });
                                    });
                                });
                            });
                        });

                        _bf.hideSocialAuthenticators();
                        
                    }
                   
                    if(typeof _bf.state_action != 'undefined')
                    {
                        _bf.state_action.fadeIn(_bf.ani_speed)
                    }
                })
            },

            // as the name says
            submitForm: function(form, event)
            {
                _bf.showStateOverlay(_bf.t('Please wait...'), 99999);

                // stop form from submitting normaly
                event.preventDefault();

                // validate the form
                if(_bf.validateForm(form))
                {
                    var inputs = form.find('._bf_input');
                    params = {};
                    params.action = form.attr('action');

                    // get the form inputs and assign them to the params array
                    inputs.each(function()
                    {
                       var val = $(this).val();

                       if($(this).attr('type') == 'password')
                       {
                           val = $.md5(val);
                       }

                       params[$(this).attr('name')] = val;
                    });

                    // submit the form
                    _bf.post(params);
                    
                    // reset item counters
                    if(_bf_itemreviews.itemqty)
                    {
                        _bf_itemreviews.itemqty = 0;
                    }
                    if(_bf_itemdiscussions.itemqty)
                    {
                        _bf_itemdiscussions.itemqty = 0;
                    }
                }
            },

            test: function()
            {
                alert("HELLO");
            },

            // post to API
            post: function(params)
            {
                // add specifics to JSON
                params['api_key'] = _bf.api_key;
                params['api_token'] = _bf.api_token;
                params['dataType'] = 'jsonp';
                params['host'] = _bf.host;
                params['pageURL'] = location.href;
                params['relation'] = _bf.relation;
                //params['callback'] = _bf.test();

                // post the form
                $.post(_bf.host + 'api/_bf_api.php', params,
                function(data)
                {
                    _bf.response(data);
                })
                .error(function(data)
                {
                    _bf.postFailed(data);
                });
            },

            // process API JSON return
            response: function(data)
            {
                // grab the JSON response
                var result = $.parseJSON(data);

                _bf.uploads = result.uploads;

                if(_bf.appname == '')
                {
                    _bf.appname = result.appname;
                    
                    $('<div />').attr(
                    {
                        'class': '_bf_powered_by'
                    })
                    .html(_bf.t('Powered by ') + '<a href="' + _bf.host + '" title="' + _bf.appname + '" target="_new">' + _bf.appname + '</a>')
                    .prependTo($('._bf_widgets_holder'));
                }

                // have we set the API token?
                if(!_bf.api_token)
                {
                    _bf.api_token = result.api_token;
                    _bf.cookie('api_token', _bf.api_token, {expires: 7});
                }

                // check and set the current state and user
                if(result.state)
                {
                    _bf.cookie('_bf_state', true, {expires: 7});
                    _bf.cookie('_bf_data', data, {expires: 7});
                }
                else
                {
                    _bf.cookie('_bf_state', false);
                    _bf.cookie('_bf_data', false);
                }

                // do we have messages from the API?
                var message = false;

                if(result.api_success)
                {
                    message = result.api_success;
                }

                if(result.api_error)
                {
                    message = result.api_error;
                }

                if(message)
                {
                    _bf.showStateOverlay(message, _bf.msg_display_time, function()
                    {
                        _bf.processAction(result);
                    });
                }
                else
                {
                    _bf.processAction(result);
                }
            },

            // stuff to do after post success
            processAction: function(result)
            {
                switch(result.action)
                {
                    case('getstate'):
                        break;

                    case('register'):
                        _bf.closePanel(function()
                        {
                            _bf.showStateActions();
                        });
                        break;

                    case('logout'):
                        _bf.buttonState();
                        _bf.showStateActions();
                        break;

                    case('fb_login'):
                    case('login'):
                        if(!result.api_error)
                        {
                            _bf.buttonState();
                            _bf.showStateActions();
                        }
                        break;

                    case('review'):

                        // Facebook post
                        if(typeof fb_lib != 'undefined')
                        {
                            if(fb_lib.loggedin())
                            {
                                if($('#fb_post_review').prop('checked'))
                                {
                                    fb_lib.postToWall(result, 'review');
                                }
                            }
                        }

                        _bf.closePanel(function()
                        {
                            _bf_itemreviews.limitfrom = 0;
                            _bf_itemreviews.init();
                            _bf.showStateActions();
                        });
                        break;

                   case('userreviews'):
                        _bf_userreviews.showReviews(result);
                        break;

                    case('itemreviews'):
                        _bf_itemreviews.showReviews(result);
                        break;

                    case('itemreviewsbytag'):
                        _bf_itemreviews.showReviews(result);
                        break;

                    case('discuss'):
                        _bf.closePanel(function()
                        {
                            _bf_itemdiscussions.limitfrom = 0;
                            _bf_itemdiscussions.init();
                            _bf.showStateActions();
                        });
                        break;

                     case('itemdiscussions'):
                        _bf_itemdiscussions.showDiscussions(result);
                        break;

                    case('userdiscussions'):
                        _bf_userdiscussions.showDiscussions(result);
                        break;

                    case('comment'):
                        _bf.closePanel(function()
                        {
                            _bf_itemdiscussions.init();
                            _bf.showStateActions();
                        });
                        break;

                     case('itemcomments'):
                        _bf_itemcomments.showComments(result);
                        break;

                    case('usercomments'):
                        _bf_usercomments.showComments(result);
                        break;

                    case('userwatches'):
                        _bf_userwatches.showWatches(result);
                        break;

                    case('removewatch'):
                        _bf.changeDashboardView('userwatches');
                        break;

                    default:
                        if(_bf.state)
                        {
                            _bf.showStateOverlay(_bf.t('Post Successful'), 1000);                                     
                        }
                        else
                        {
                            // something here?
                        }
                        break;
                }
                
                // if we have a function call coming back, run it!
                if(typeof result.callback != 'undefined')
                {
                    eval(result.callback)
                }
            },

            // Houston, we have a problem!
            postFailed: function(data)
            {
                _bf.showStateOverlay(_bf.t('Something went wrong!'));
            },

            // logout
            logout:function(callback)
            {
                _bf.showStateOverlay(_bf.t('Please wait...'), 99999);
                
                if(typeof fb_lib != 'undefined')
                {
                    fb_lib.logout();
                }
                                
                var params = 
                {
                    action: 'logout'
                }
                _bf.post(params);
                
                if($.isFunction(callback))
                {
                    callback.call(this);
                }                
            },

            // validate form inputs
            validateForm: function(form)
            {
                var error = false;

                var inputs = form.find('._bf_input');
                var action = form.attr('action');

                inputs.removeClass('_bf_validation_error');

                inputs.each(function()
                {
                    // have we completed all inputs?
                    if(($(this).attr('type') != 'checkbox') && (!$(this).hasClass('_bf_ignore_validation')))
                    {  
                        // value equals placeholder?
                        if(($(this).attr('placeholder')) && ($(this).attr('value') == $(this).attr('placeholder')))
                        {
                            error = true;
                        }

                        if($(this).val() == '')
                        {
                            error = true;
                        }       

                        if(error)
                        {
                            $(this).addClass('_bf_validation_error');

                            if($(this).attr('placeholder'))
                            {
                                error = $(this).attr('placeholder') + _bf.t(' required');
                            }
                            else
                            {
                                error = _bf.t('Please complete all fields');                                    
                            }

                            return false;
                        }
                    }
                });

                if(!error)
                {
                    if($('._bf_register_terms').length)
                    {
                        // have we agreed to terms?
                        if(typeof $('._bf_register_terms').attr('checked') == 'undefined')
                        {
                            error = _bf.t('Please comply with our terms & conditions');
                        }                    
                    }
                }

                if(!error)
                {
                    if($('._bf_register_password2').length)
                    {
                        // do our passwords match?
                        if($('._bf_register_password').val() != $('._bf_register_password2').val())
                        {
                            error = _bf.t('Password fields do not match');
                        }                                    
                    }
                }

                if(!error)
                {
                    if($('._bf_changepassword_password2').length)
                    {
                        // do our passwords match?
                        if($('._bf_changepassword_password').val() != $('._bf_changepassword_password2').val())
                        {
                            error = _bf.t('Password fields do not match');
                        }                                    
                    }
                }

                if(!error)
                {
                    if($('._bf_input_email').length)
                    {
                        form.find('._bf_input_email').each(function()
                        {
                            // valid email address?
                            if(!_bf.isValidEmail($(this).val()))
                            {
                                $(this).addClass('_bf_validation_error');

                                error = _bf.t('Invalid email address');

                                return false;
                            }                               
                        });
                    }
                }

                if(!error)
                {
                    if($('._bf_changeemail_confirmemail').length)
                    {
                        // do our passwords match?
                        if($('._bf_changeemail_newemail').val() != $('._bf_changeemail_confirmemail').val())
                        {
                            error = _bf.t('Email fields do not match');
                        }                                    
                    }
                }

                if(error)
                {
                    _bf.showStateOverlay(error);
                    return false;
                }
                else
                {
                    return true;
                }
            },

            // check email format
            isValidEmail: function(email)
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
            },

            // remove spaces from a string
            stripSpaces: function(str)
            {
                return str.replace(/ /g, "");
            },

            // format string for output
            safeHTML: function(str)
            {
                str = _bf.linkify(str);
                return str.replace(/\\/g, "");
            },

            // remove the social links
            hideSocialAuthenticators: function(callback)
            {
                if(typeof fb_lib != 'undefined')
                {
                    fb_lib.button('hide');
                }
                
                if($.isFunction(callback))
                {
                    callback.call(this);
                }                
            },

            // show the social links
            showSocialAuthenticators: function()
            {
                if(typeof fb_lib != 'undefined')
                {
                    fb_lib.button('show');
                }
            },
            
            // create and display subscription options
            showSubscribes: function(el, type, api_key)
            {
                $('<div />').attr(
                {
                    'class': '_bf_items_subscribe'
                })
                .html(_bf.t('Subscribe'))
                .appendTo(el)
                .each(function()
                {
                    $('<a />').attr(
                    {
                        'class': '_bf_items_rss',
                        'href': _bf.host + 'api/rss.php?type=' + type + '&apikey=' + api_key + '&relation=' + _bf.relation,
                        'title': _bf.t("Subscribe to this item's feed")
                    })
                    .html('<acronym title="Really Simple Syndication">RSS</acronym>')
                    .appendTo($(this))

                    $('<div />').attr(
                    {
                        'class': '_bf_items_email',
                        'title': _bf.t("Subscribe to this item via Email")
                    })
                    .html(_bf.t('Email'))
                    .click(function()
                    {
                        _bf.post(
                        {
                            action: 'watchviaemail',
                            type: type,
                            title: document.title,
                            url: document.location.href
                        });                    
                    })
                    .appendTo($(this))                            
                })                
            },

            // dynamically create a form element
            createFormElement: function(form, params, callback)
            {
                var formname = form.attr('name');

                if(typeof params.readonly != 'undefined')
                {
                    params.readonly = 'readonly';

                }
                else
                {
                    params.readonly = false;
                }

                if(typeof params.validate == 'undefined')
                {
                    params.validate = '';

                }
                else
                {
                    if(!params.validate)
                    {
                        params.validate = ' _bf_ignore_validation';
                    }
                    else
                    {
                        params.validate = '';
                    }
                }

                var row = $('<div />').attr(
                {
                    'class': '_bf_form_row _bf_form_row_' + params.name + params.validate
                })
                .appendTo(form)
                .each(function()
                {
                    if(params.type != 'hidden')
                    {
                        var label = $('<label />').attr(
                        {
                            'class': '_bf_form_label',
                            'for': '_bf_' + formname + '_' + params.name
                        })
                        .html(params.title)
                        .appendTo($(this));
                    }

                    if(params.obj == 'textarea')
                    {
                        var obj = $('<' + params.obj + ' />').attr(
                        {
                            rows: params.rows,
                            cols: params.cols,
                            name: params.name,
                            id: '_bf_' + formname + '_' + params.name,
                            'class': '_bf_input _bf_' + formname + '_' + params.name + ' _bf_input_' + params.name + (params.cls ? ' ' + params.cls : ''),
                            value: params.value,
                            readonly: params.readonly
                        })
                        .appendTo($(this));                            
                    }

                    if(params.obj == 'input')
                    {
                        var obj = $('<' + params.obj + ' />').attr(
                        {
                            type: params.type,
                            name: params.name,
                            id: '_bf_' + formname + '_' + params.name,
                            'class': '_bf_input _bf_' + formname + '_' + params.name + ' _bf_input_' + params.name + (params.cls ? ' ' + params.cls : ''),
                            value: params.value,
                            readonly: params.readonly
                        })
                        .appendTo($(this));                            
                    }

                });

                if($.isFunction(callback))
                {
                    callback.call(this);
                }                
            },


            // placeholder text swap out for inputs
            checkPlaceholders: function(form)
            {
                $(form).find('._bf_form_row').each(function()
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
                            left: pos.left + 31 + 'px'
                        })
                        .addClass('pos-fixed')
                        .each(function()
                        {
                            field.focus(function()
                            {
                                label.fadeTo(_bf.ani_speed, 0).hide();
                            })
                            .blur(function()
                            {
                                if($(this).val() == '')
                                {
                                    label.show().fadeTo(_bf.ani_speed, 1);
                                }
                            })

                            if(field.val() != '')
                            {
                                label.fadeTo(_bf.ani_speed, 0).hide();
                            }
                        });
                    }
                })
            },

            // load in the required view
            getForm: function(data, callback)
            {
                // clean up first
                _bf.removeForms(function()
                {
                    // now load new form
                    _bf_loadscript(_bf.host + 'api/views/' + data.form + '.js');

                    _bf.loadWait(data);

                    if($.isFunction(callback))
                    {
                        callback.call(this);
                    }
                });

            },

            // wait for form (data) to load
            loadWait: function(data)
            {
                var data = data;

                if($('._bf_state_form').length)
                {
                    var formholder = '';

                    if($('._bf_dashboard').length)
                    {
                        formholder = $('._bf_dashboard');
                    }

                    if($('._bf_state').length)
                    {
                        formholder = $('._bf_state');
                    }

                    // grab the new form
                    $('._bf_state_form').each(function()
                    {
                        // display the form
                        _bf.showForm(data.form);

                        // if we have a parent id (we're an item) then pass it on
                        if($('._bf_' + data.form + '_parentid').length)
                        {
                            $('._bf_' + data.form + '_parentid').val(data.parentid);
                        }

                    });

                }
                else
                {
                    setTimeout(function()
                    {
                        _bf.loadWait(data)
                    }, 
                    100);
                }
            },


            // show a loaded form
            showForm: function(formname, callback)
            {
                // show the form
                $('._bf_' + formname + '_form')
                .hide()
                .fadeIn(_bf.ani_speed);

                // sort out the place holder text
                _bf.checkPlaceholders($('._bf_' + formname + '_form'));

                if($.isFunction(callback))
                {
                    callback.call(this);
                }
            },

            // clean up all forms from state panel
            removeForms: function(callback)
            {
                // grab any forms in the panel
                _bf.state_panel.find('form').each(function()
                {
                    // fade the form out
                    $(this).fadeOut(_bf.ani_speed,
                    function()
                    {
                        // remove from from node list
                        _bf.cleanUp($(this));
                    });
                });

                if($.isFunction(callback))
                {
                    callback.call(this);
                }
            },

            // show form links if required
            showFormLinks: function(formname)
            {
                _bf_loadscript(_bf.host + 'api/views/formlinks.js');
            },

            // load the required dashboard form
            changeDashboardView: function(obj)
            {
                var obj = $('._bf_dbaction_' + obj);
                
                $('._bf_dashboard_action').each(function()
                {
                    var rel = $(this).attr('rel');

                    $('._bf_' + rel).remove();
                })

                $('._bf_dashboard_action').removeClass('active_action');
                obj.addClass('active_action');

                _bf.getForm({form: obj.attr('rel')});
            },

            // get just the filename from a string
            basename: function(path)
            {
                return path.replace(/\\/g,'/').replace( /.*\//, '' );
            },

            // check media type
            mediaType: function(type, filename)
            {
                var extension = filename.substr( (filename.lastIndexOf('.') +1) );
                
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
            
            linkify: function(text) 
            {
		if( !text ) return text;
		
		text = text.replace(/((https?\:\/\/|ftp\:\/\/)|(www\.))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi,function(url){
			nice = url;
			if( url.match('^https?:\/\/') )
			{
				nice = nice.replace(/^https?:\/\//i,'')
			}
			else
				url = 'http://'+url;
			
			
			return '<a target="_blank" rel="nofollow" href="'+ url +'">'+ nice.replace(/^www./i,'') +'</a>';
		});
		
		return text;
            },

            // cookies, yummy!
            cookie: function (key, value, options) {

                // key and at least value given, set cookie...
                if (arguments.length > 1 && String(value) !== "[object Object]") {
                    options = jQuery.extend({}, options);

                    if (value === null || value === undefined) {
                        options.expires = -1;
                    }

                    if (typeof options.expires === 'number') {
                        var days = options.expires, t = options.expires = new Date();
                        t.setDate(t.getDate() + days);
                    }

                    value = String(value);

                    return (document.cookie = [
                        encodeURIComponent(key), '=',
                        options.raw ? value : encodeURIComponent(value),
                        // use expires attribute, max-age is not supported by IE
                        options.expires ? '; expires=' + options.expires.toUTCString() : '', 
                        options.path ? '; path=' + options.path : '',
                        options.domain ? '; domain=' + options.domain : '',
                        options.secure ? '; secure' : ''
                    ].join(''));
                }

                // key and possibly options given, get cookie...
                options = value || {};
                var result, decode = options.raw ? function (s) {return s;} : decodeURIComponent;
                return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
            },

            // Accepts a url and a callback function to run.
            requestCrossDomain: function( site, callback )
            {
                // If no url was passed, exit.
                if ( !site ) {
                        alert('No site was passed.');
                        return false;
                }

                // Take the provided url, and add it to a YQL query. Make sure you encode it!
                var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + site + '"') + '&format=xml&callback=cbFunc';

                // Request that YSQL string, and run a callback function.
                // Pass a defined function to prevent cache-busting.
                $.getJSON( yql, cbFunc );

                function cbFunc(data)
                {
                    // If we have something to work with...
                    if ( data.results[0] )
                    {
                            // Strip out all script tags, for security reasons.
                            // BE VERY CAREFUL. This helps, but we should do more.
                            data = data.results[0].replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

                            // If the user passed a callback, and it
                            // is a function, call it, and send through the data var.
                            if ( typeof callback === 'function')
                            {
                                    callback(data);
                            }
                    }
                    // Else, Maybe we requested a site that doesn't exist, and nothing returned.
                    else throw new Error('Nothing returned from getJSON.');
                }
            }
        }

        // initialise BiFrost
        _bf.init();

    });
    
}

// GO...
_bf_begin();

