/* 
    Application: BiFrost
    Document   : itemdiscussions.js
    Created on : 27-Oct-2011
    Author     : Paul Whitrow
    Description: Grab and render the discussions
*/

var _bf_itemdiscussions = {

    limitfrom: 0,
    limitqty: 5,
    lazyloading:false,
    itemqty: 0,

    init: function()
    {        
        _bf.widgetLoading('discussions');
    },

    getDiscussions: function()
    {
        // do we need to load any more?
        if($('._bf_discussions_qty').length)
        {
            if(_bf_itemdiscussions.lazyloading)
            {
                if(_bf_itemdiscussions.itemqty >= parseInt($('._bf_discussions_qty').html()))
                {
                    _bf_itemdiscussions.clearLazyLoader();
                    return false;
                }
            }
        }
        
        // show movement if we're not lazy loading
        if(!_bf_itemdiscussions.lazyloading)
        {
            _bf_itemdiscussions.fadeDiscussions();
        }
        
        _bf.post(
        {
            action: 'itemdiscussions',
            limitfrom: _bf_itemdiscussions.limitfrom,
            limit: _bf_itemdiscussions.limitqty,
            parentid: $('._bf_discussions').attr('rel')
        });
    },

    fadeDiscussions: function()
    {
        $('._bf_itemdiscussions_item').fadeTo(_bf.ani_speed, 0.2)
    },
    
    showDiscussions: function(data)
    {
        var discussions = $.parseJSON(data.itemdiscussions);
        var comments = $.parseJSON(data.itemcomments);

        
        _bf_itemdiscussions.recordqty = discussions.recordqty;

        if(_bf_itemdiscussions.lazyloading)
        {
            _bf_itemdiscussions.clearLazyLoader();
            _bf_itemdiscussions.processDiscussions(discussions, comments);
            return false;           
        }
        else
        {
            $('._bf_itemdiscussions').remove();
            
            if(!$('._bf_discussions_control').length)
            {
                $('<div />').attr(
                {
                    'class': '_bf_discussions_control'
                })
                .html(_bf.t('Discussions'))
                .appendTo($('._bf_widgets_controller'))
                .click(function()
                {
                    _bf.widgetSwitch('discussions')
                });            
            }            

            $('<ul />').attr(
            {
                'class': '_bf_itemdiscussions'
            })
            .html(
                $('<li />').attr(
                {
                    'class': '_bf_itemdiscussions_header'
                })
                .each(function()
                {
                    _bf.widgetButton('discuss', 'Start a discussion', 'Start a discussion', 302, 556, $(this));

                    _bf.showSubscribes($(this), 'discussions', data.api_key);

                    $('._bf_discussions_qty').remove();

                    $('<em />').attr(
                    {
                        'class': '_bf_widget_control_subtxt _bf_discussions_qty',
                        'title': discussions.recordqty + ' ' + (discussions.recordqty == 1 ? _bf.t('entry') : _bf.t('entries'))
                    })
                    .html(discussions.recordqty)
                    .appendTo($('._bf_discussions_control'))
                })
            )
            .appendTo($('._bf_discussions'))
            .each(function()
            {
                if(typeof discussions.id != 'undefined')
                {
                    _bf_itemdiscussions.processDiscussions(discussions, comments);
                }
                else
                {
                    if(!_bf_itemdiscussions.lazyloading)
                    {
                        $('<h2 />').attr(
                        {
                            'class': '_bf_no_discussions _bf_itemdiscussions'
                        })
                        .html(_bf.t('Why not be the first to post a discussion?'))
                        .appendTo($('._bf_discussions'));
                    }                        
                }
            _bf.widgetLoaded('discussions');        
            });
            
        }
        
        if($('._bf_reviews').length)
        {
            _bf.widgetSwitch('reviews');
        }
        else
        {
            _bf.widgetSwitch('discussions');
        }
    },

    processDiscussions: function(discussions, comments)
    {
        var i = 0;

        $(discussions.id).each(function()
        {
            _bf_itemdiscussions.renderDiscussion(
            {
                id: discussions.id[i],
                gname: discussions.gname[i],
                fname: discussions.fname[i],
                avatar: discussions.avatar[i],
                content: discussions.content[i],
                fdate: discussions.fdate[i],
                isodate: discussions.isodate[i],
                number: _bf_itemdiscussions.itemqty + 1
            }, comments);
            
            i++;
            _bf_itemdiscussions.itemqty++;
        });

        $('<div />').attr(
        {
            'class': '_bf_clear'
        })
        .appendTo($('._bf_discussions'));

         $('.postdate').timeago();

        _bf.widgetLoaded('discussions');
        
        //_bf.paginator(_bf_itemreviews, $('._bf_itemdiscussions'));
        _bf_itemdiscussions.setLazyLoader();  
    },
    
    setLazyLoader: function()
    {
        // lazy load?
        $(window).scroll(function()
        {
            if(_bf.current_widget == 'discussions')
            {
                if  ($(window).scrollTop() == $(document).height() - $(window).height())
                {
                   _bf_itemdiscussions.lazyLoad();
                }
            }
            
            _bf.sticky('discussions');
        });
        
        _bf_itemdiscussions.clearLazyLoader();
    },
    
    clearLazyLoader: function()
    {
        $('._bf_discussions_lazyloading').remove();
        _bf_itemdiscussions.lazyloading = false;                            
    },
    
    lazyLoad: function() 
    {
        _bf_itemdiscussions.lazyloading = true;
        
        if(!$('._bf_discussions_lazyloading').length)
        {
            $('<div />').attr(
            {
                'class': '_bf_discussions_lazyloading'
            })
            .html(_bf.t('Loading') + '...')
            .appendTo($('._bf_discussions'))
            .each(function()
            {
                _bf_itemdiscussions.limitfrom += _bf_itemdiscussions.limitqty;
                _bf_itemdiscussions.getDiscussions();
            });            
        }                    
    },
    
    renderDiscussion: function(discussion, comments)
    {
        $('<li />').attr(
        {
            'class': '_bf_itemdiscussions_item',
            id: 'discussion_' + discussion.id
        })
        .appendTo($('._bf_itemdiscussions'))
        .each(function()
        {
            $('<span />').attr(
            {
                'class': '_bf_itemdiscussions_item_number'
            })
            .html(discussion.number)
            .appendTo($(this))
            
            $('<div />').attr(
            {
                'class': '_bf_itemdiscussions_arrow_up'
            })
            .appendTo($(this));

            $('<p />').attr(
            {
                'class': '_bf_itemdiscussions_item_synopsis _bf_itemdiscussions_item_synopsis_' + discussion.id
            })
            .html(discussion.content.replace(/\\/g, ""))
            .appendTo($(this))
            .each(function()
            {
                var el = $(this);
                var c = 0;

                $('<ul />').attr(
                {
                    'class': '_bf_itemdiscussions_item_comment_holder _bf_comment_' + discussion.id
                })
                .appendTo($(el).parent())
                .each(function()
                {
                    $('<li />').attr(
                    {
                        'class': '_bf_itemdiscussions_item_controls'
                    })
                    .appendTo($(this))
                    .each(function()
                    {
                        $('<div />').attr(
                        {
                            'class': '_bf_itemdiscussions_item_reply_button _bf_button _bf_button_blue'
                        })
                        .html(_bf.t('Reply'))
                        .appendTo($(this))
                        .click(function()
                        {
                            if(_bf.loggedIn())
                            {
                                _bf.openPanel(333, 600, function()
                                {
                                    $('._bf_dashboard').remove();

                                    _bf.getForm(
                                    {
                                        form: 'comment',
                                        parentid: discussion.id
                                    });
                                });
                            }
                            else
                            {
                                _bf.cannotPost();
                            }
                        });

                        // more link!
                        $(this).expander(
                        {
                            'expand': $('._bf_itemdiscussions_item_synopsis_' + discussion.id)
                        });
                        
                    });
                    

                });
                
                if(typeof comments != 'undefined')
                {
                    $(comments.id).each(function()
                    {
                        if(comments.parentid[c] == discussion.id)
                        {
                            $('<li />').attr(
                            {
                                'class': '_bf_itemdiscussions_item_comment'
                            })
                            .appendTo($('._bf_comment_' + discussion.id))
                            .each(function()
                            {
                                $('<div />').attr(
                                {
                                    'class': '_bf_itemdiscussions_arrow_right'
                                })
                                .appendTo($(this));

                                $('<div />').attr(
                                {
                                    'class': '_bf_itemdiscussions_item_comment_content'
                                })
                                .html(comments.content[c].replace(/\\/g, ""))
                                .appendTo($(this))
                                .each(function()
                                {
                                    // more link!
                                    $(this).expander();
                                });

                                $('<div />').attr(
                                {
                                    'class': '_bf_itemdiscussions_item_comment_username'
                                })
                                .html(comments.gname[c] + ' ' + comments.fname[c])
                                .appendTo($(this));

                                $('<div />').attr(
                                {
                                    'class': '_bf_itemdiscussions_item_comment_avatarholder'
                                })
                                .appendTo($(this))
                                .each(function()
                                {
                                    $('<img />').attr(
                                    {
                                        'class': '_bf_itemdiscussions_item_comment_useravatar',
                                        src: comments.avatar[c],
                                        height: '40',
                                        width: '40',
                                        title: comments.gname[c] + ' ' + comments.fname[c],
                                        alt: comments.gname[c] + ' ' + comments.fname[c]
                                    })
                                    .appendTo($(this));
                                });

                                $('<em />').attr(
                                {
                                    'class': '_bf_itemdiscussions_item_comment_posted postdate',
                                    title: comments.isodate[c]
                                })
                                .html(comments.fdate[c])
                                .appendTo($(this));
                            });
                        }
                        c++;
                    });
                    
                }
            });

            $('<h3 />').attr(
            {
                'class': '_bf_itemdiscussions_item_username',
                title: discussion.gname + ' ' + discussion.fname
            })
            .html(discussion.gname + ' ' + discussion.fname)
            .appendTo($(this));

            $('<div />').attr(
            {
                'class': '_bf_itemdiscussions_item_avatarholder'
            })
            .appendTo($(this))
            .each(function()
            {
                $('<img />').attr(
                {
                    'class': '_bf_itemdiscussions_item_useravatar',
                    src: discussion.avatar,
                    height: '50',
                    width: '50',
                    title: discussion.gname + ' ' + discussion.fname,
                    alt: discussion.gname + ' ' + discussion.fname
                })
                .appendTo($(this));
            });

            $('<em />').attr(
            {
                'class': '_bf_itemdiscussions_item_posted postdate',
                title: discussion.isodate
            })
            .html(_bf.t('Posted') + ': ' + discussion.fdate)
            .appendTo($(this));

            $('<div />').attr(
            {
                'class': '_bf_clear'
            })
            .appendTo($(this));

        });
    }
}

_bf_itemdiscussions.init();