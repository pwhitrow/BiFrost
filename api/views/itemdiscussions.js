/*
 * item discussions
 */

var _bf_itemdiscussions = {

    limitfrom: 0,
    limitqty: 5,

    init: function()
    {        
        _bf.widgetLoading('discussions');
    },

    getDiscussions: function()
    {
        _bf.post(
        {
            action: 'itemdiscussions',
            limitfrom: this.limitfrom,
            limitqty: this.limitqty,
            parentid: $('._bf_discussions').attr('rel')
        });
    },

    showDiscussions: function(data)
    {
        $('._bf_itemdiscussions').remove();
            
        var discussions = $.parseJSON(data.itemdiscussions);
        var comments = $.parseJSON(data.itemcomments);

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

        if(typeof discussions.id != 'undefined')
        {
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
                    _bf.widgetButton('discuss', 'Start a discussion', 'Start a discussion', 335, 600, $(this));
                    
                    $('._bf_discussions_qty').remove();
                    
                    $('<em />').attr(
                    {
                        'class': '_bf_widget_control_subtxt _bf_discussions_qty'
                    })
                    .html('(' + discussions.recordqty + ')')
                    .appendTo($('._bf_discussions_control'))
                })
            )
            .appendTo($('._bf_discussions'))
            .each(function()
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
                        isodate: discussions.isodate[i]
                    }, comments);
                    i++;
                });

                $('<div />').attr(
                {
                    'class': '_bf_clear'
                })
                .appendTo($('._bf_discussions'));
                
                _bf.widgetLoaded('discussions');
            });
            
            $('.postdate').timeago();
        }
        else
        {
            $('<h2 />').attr(
            {
                'class': '_bf_no_discussions _bf_itemdiscussions'
            })
            .html(_bf.t('Why not be the first to post a discussion?'))
            .appendTo($('._bf_discussions'));
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
            $('<div />').attr(
            {
                'class': '_bf_itemdiscussions_arrow_up'
            })
            .appendTo($(this));

            $('<p />').attr(
            {
                'class': '_bf_itemdiscussions_item_synopsis _bf_itemdiscussions_item_synopsis_' + discussion.id
            })
            .html(discussion.content)
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
                            'class': '_bf_itemdiscussions_item_reply_button _bf_button'
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
                            .html(comments.content[c])
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