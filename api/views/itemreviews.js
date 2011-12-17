/*
 * item reviews
 */

var _bf_itemreviews = {
    
    limitfrom: 0,
    limitqty: 3,
    pagenum: 1,
    recordqty: 0,

    init: function()
    {
        // inform the user
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
            .appendTo($('._bf_reviews'))
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
        
        
    },
    
    getReviews: function()
    {
        _bf.post(
        {
            action: 'itemreviews',
            limitfrom: _bf_itemreviews.limitfrom,
            limit: _bf_itemreviews.limitqty,
            uploads: _bf.uploads,
            noimage: _bf.no_image,
            parentid: $('._bf_reviews').attr('rel')
        });        
    },
    
    paginator: function()
    {
        $('<ul />').attr(
        {
            'class': '_bf_items_paginator'
        })
        .prependTo($('._bf_itemreviews'))
        .each(function()
        {
            var qty = Math.ceil(_bf_itemreviews.recordqty / _bf_itemreviews.limitqty);

            for(i = 1; i < qty + 1; i++)
            {
                var el = $('<li />').attr(
                {
                    'class': _bf_itemreviews.pagenum == i ? '_bf_items_pager_disabled' : '_bf_items_pager',
                    'rel': (i > 1 ? _bf_itemreviews.limitqty * (i - 1) : 0),
                    'title': _bf.t('Go to page') + ' ' + i + ' ' + _bf.t('of') + ' ' + qty
                })
                .html(i)
                .appendTo($(this));
                
                if(_bf_itemreviews.pagenum != i)
                {
                    el.click(function()
                    {
                        $('._bf_itemreviews').css(
                        {
                            'opacity': 0.6
                        });
                        
                        var x = parseInt($(this).html());
                        
                        _bf_itemreviews.pagenum = x;
                        
                        _bf_itemreviews.limitfrom = $(this).attr('rel');
                        
                        _bf_itemreviews.getReviews();
                    });
                }
            }
        })
    },

    showReviews: function(data)
    {
        $('._bf_reviews_fetching').hide();
        
        $('._bf_itemreviews').remove();
            
        var reviews = $.parseJSON(data.itemreviews);
        
        _bf_itemreviews.recordqty = reviews.recordqty;

        if(!$('._bf_reviews_control').length)
        {
            $('<div />').attr(
            {
                'class': '_bf_reviews_control'
            })
            .html(_bf.t('Reviews'))
            .prependTo($('._bf_widgets_controller'))
            .click(function()
            {
                _bf.widgetSwitch('reviews')
            });            
        }                    

        if(typeof reviews.id != 'undefined')
        {
            $('<ul />').attr(
            {
                'class': '_bf_itemreviews'
            })
            .html(
                $('<li />').attr(
                {
                    'class': '_bf_itemreviews_header'
                })
                .each(function()
                {
                    _bf.widgetButton('review', 'Post a review', 'Post a review', 425, 600, $(this));
        
                    var itemrating = $.parseJSON(data.itemrating);
                    
                    $('<p />').attr(
                    {
                        'class': '_bf_itemreviews_avg_rating',
                        id: '_bf_itemreviews_avg_rating'
                    })
                    .appendTo($(this))
                    .each(function()
                    {
                        $(this).raty(
                        {
                            readOnly:  true,
                            start:     parseInt(itemrating.avg_rating),
                            path: _bf.host + 'api/plugins/raty/img'
                        });
                        
                        $('<em />').attr(
                        {
                            'class': '_bf_itemreviews_avg_rating_text'
                        })
                        .html('(' + _bf.t('averaged from') + ' ' + itemrating.num_ratings + ' ' + _bf.t('review') + (itemrating.num_ratings == 1 ? '' : 's') + ')')
                        .appendTo($(this))
                        .each(function()
                        {
                            $('._bf_reviews_qty').remove();
                            
                            $('<em />').attr(
                            {
                                'class': '_bf_widget_control_subtxt _bf_reviews_qty'
                            })
                            .html('(' + itemrating.num_ratings + ')')
                            .appendTo($('._bf_reviews_control'))
                        });
                    });
                })
            )
            .appendTo($('._bf_reviews'))
            .each(function()
            {                
                var i = 0;

                $(reviews.id).each(function()
                {
                    _bf_itemreviews.renderReview(
                    {
                        id: reviews.id[i],
                        gname: reviews.gname[i],
                        fname: reviews.fname[i],
                        avatar: reviews.avatar[i],
                        rated: reviews.rated[i],
                        media: reviews.media[i],
                        title: reviews.title[i],
                        content: reviews.content[i],
                        fdate: reviews.fdate[i],
                        tags: reviews.tags[i],
                        tagnames: reviews.tagnames[i]
                    });
                    
                    i++;
                });
                
                $("a._bf_itemreviews_media_link").showBox(
                {
                  'path': _bf.host,
                  'speed': _bf.ani_speed,
                  'default_img': _bf.host + 'images/' + _bf.no_image
                });
                
                _bf_itemreviews.paginator();

                $('<div />').attr(
                {
                    'class': '_bf_clear'
                })
                .appendTo($('._bf_reviews'));
            });
        }
        else
        {
            $('<h2 />').attr(
            {
                'class': '_bf_no_reviews _bf_itemreviews'
            })
            .html(_bf.t('Why not be the first to post a review?'))
            .appendTo($('._bf_reviews'));
        }        
        
        _bf.widgetSwitch('reviews');
        
    },

    renderReview: function(review)
    {
        $('<li />').attr(
        {
            'class': '_bf_itemreviews_item',
            id: 'review_' + review.id
        })
        .appendTo($('._bf_itemreviews'))
        .each(function()
        {
            // show tags
            if(review.tags)
            {
                $('<div />').attr(
                {
                    'class': '_bf_itemreviews_tags'
                })
                .html(_bf.t('Tagged') + ': ')
                .appendTo($(this))
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
                .each(function()
                {
                    var tags = review.tags.split(',');
                    var tagnames = review.tagnames.split(',');
                    
                    for(i = 0; i < tags.length; i++)
                    {
                        $('<a />').attr(
                        {
                            href: _bf.host + '/' + tags[i],
                            title: _bf.t('Find more reviews tagged with') + tagnames[i],
                            rel: 'tag_' + tags[i],
                            'class': '_bf_itemreviews_tag_link'
                        })
                        .html(tagnames[i])
                        .appendTo($(this))
                        .each(function()
                        {
                            if(i < (tags.length - 1))
                            {
                                $(this).append(',');
                            }
                        });
                    }
                });
            }
            
            $('<p />').attr(
            {
                'class': '_bf_itemreviews_item_synopsis'
            })
            .html(review.content)
            .appendTo($(this))
            .each(function()
            {
                $('<h2 />').attr(
                {
                    'class': '_bf_itemreviews_item_title',
                    title: review.title
                })
                .html(review.title)
                .prependTo($(this));

                // call expander plugin
                $(this).expander();
            });

            $('<h3 />').attr(
            {
                'class': '_bf_itemreviews_item_username',
                title: review.gname + ' ' + review.fname
            })
            .html(review.gname + ' ' + review.fname + ' <em>' + _bf.t('says') + ':</em>')
            .appendTo($(this));

            $('<img />').attr(
            {
                'class': '_bf_itemreviews_item_useravatar',
                src: review.avatar,
                height: '50',
                width: '50',
                border: 0,
                title: review.gname + ' ' + review.fname,
                alt: review.gname + ' ' + review.fname
            })
            .appendTo($(this));

            $('<em />').attr(
            {
                'class': '_bf_itemreviews_item_posted',
                title: _bf.t('This review was posted ') + ': ' + review.fdate
            })
            .html(_bf.t('Posted') + ': ' + review.fdate)
            .appendTo($(this));

            $('<p />').attr(
            {
                'class': '_bf_itemreviews_item_rating',
                id: '_bf_itemreviews_item_rating_' + review.id
            })
            .appendTo($(this))
            .each(function()
            {
                $(this).raty(
                {
                    readOnly:  true,
                    start:     parseInt(review.rated),
                    path: _bf.host + 'api/plugins/raty/img'
                });
            });

            // show media
            if(review.media.length)
            {
                $('<div />').attr(
                {
                    'class': '_bf_itemreviews_media'
                })
                .html(function()
                {
                    var media = review.media.split(',');

                    for(i = 0; i < media.length; i++)
                    {
                        if(media[i] == _bf.no_image)
                        {
                            continue;
                        }

                        var image = _bf.host + _bf.uploads + '/' + media[i]
                        var ext = media[i].substr((media[i].lastIndexOf('.') +1));
                        
                        if($.inArray(ext, ['jpeg', 'jpg', 'gif', 'png']) > -1)
                        {
                            var tmp = media[i].split('.');
                            var thumb = _bf.host + _bf.uploads + '/' + tmp[0] + '_thumb.' + ext;     
                        }
                        else
                        {
                            var thumb = _bf.host + 'images/' + _bf.vid_image;
                        }
                        
                        $('<a />').attr(
                        {
                            href: image,
                            title: _bf.t('Image for ') + review.title,
                            rel: 'gallery_' + review.id,
                            'class': '_bf_itemreviews_media_link'
                        })
                        .each(function()
                        {
                            $('<img />').attr(
                            {
                                'class': '_bf_itemreviews_media_item',
                                alt: $(this).attr('title'),
                                height: '50',
                                width: '50',
                                border: 0,
                                src: thumb
                            })
                            .appendTo($(this));
                        })
                        .appendTo($(this));
                    }
                })
                .appendTo($(this));
            }      
            
            $(this).socials(
            {
                path: _bf.host + 'api/plugins/socials/',
                title: review.title,
                href: $(location).attr('href') + '#review_' + review.id
            });
        });
    }
}

_bf_itemreviews.init();

