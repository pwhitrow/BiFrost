/* 
    Application: BiFrost
    Document   : itemreviews.js
    Created on : 27-Oct-2011
    Author     : Paul Whitrow
    Description: Grab and render the reviews
*/

var _bf_itemreviews = {
    
    limitfrom: 0,
    limitqty: 5,
    tagging: false,
    lazyloading:false,
    itemqty: 0,

    init: function()
    {
        _bf.widgetLoading('reviews');       
    },
    
    getReviews: function()
    {
        if(!_bf_itemreviews.lazyloading)
        {
            _bf_itemreviews.fadeReviews();
        }
        
        // do we need to load any more?
        if($('._bf_reviews_qty').length)
        {
            if(_bf_itemreviews.lazyloading)
            {
                if(_bf_itemreviews.itemqty >= parseInt($('._bf_reviews_qty').html()))
                {
                    _bf_itemreviews.clearLazyLoader();
                    return false;
                }
            }
        }

        if(_bf_itemreviews.tagging)
        {
            _bf.post(
            {
                action: 'itemreviewsbytag',
                limitfrom: _bf_itemreviews.limitfrom,
                limit: _bf_itemreviews.limitqty,
                uploads: _bf.uploads,
                noimage: _bf.no_image,
                parentid: $('._bf_reviews').attr('rel'),
                tag: _bf_itemreviews.tagging
            });                    
        }
        else
        {
            _bf_itemreviews.tagging = false;

            _bf.post(
            {
                action: 'itemreviews',
                limitfrom: _bf_itemreviews.limitfrom,
                limit: _bf_itemreviews.limitqty,
                uploads: _bf.uploads,
                noimage: _bf.no_image,
                parentid: $('._bf_reviews').attr('rel')
            });                   
        }
    },
    
    fadeReviews: function()
    {
        $('._bf_itemreviews_item').fadeTo(_bf.ani_speed, 0.2)
    },
    
    getAvgRating: function(reviews)
    {
        var rated = 0;
        
        for(i = 0; i < reviews.rated.length; i++)
        {
            rated += parseInt(reviews.rated[i]);
        }
        
        return Math.ceil(rated/reviews.recordqty);
    },
    
    showReviews: function(data)
    {
        var reviews = $.parseJSON(data.itemreviews);
        
        _bf_itemreviews.recordqty = reviews.recordqty;

        if(_bf_itemreviews.lazyloading)
        {
            _bf_itemreviews.clearLazyLoader();
            _bf_itemreviews.processReviews(reviews);
            return false;           
        }
        else
        {
            $('._bf_itemreviews').remove();

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
                    var itemrating = $.parseJSON(data.itemrating);

                    _bf.widgetButton('review', 'Post a review', 'Post a review', 380, 593, $(this));

                    _bf.showSubscribes($(this), 'reviews', data.api_key);

                    $('<p />').attr(
                    {
                        'class': '_bf_itemreviews_avg_rating',
                        id: '_bf_itemreviews_avg_rating'
                    })
                    .appendTo($(this))
                    .each(function()
                    {
                        if(typeof reviews.rated != 'undefined')
                        {
                            var avg = _bf_itemreviews.getAvgRating(reviews);
                        }
                        else
                        {
                            var avg = 0;
                        }

                        $(this).raty(
                        {
                            readOnly:  true,
                            start:     avg,
                            path: _bf.host + 'api/plugins/raty/img',
                            half: false
                        });

                        $('<em />').attr(
                        {
                            'class': '_bf_itemreviews_avg_rating_text'
                        })
                        .html('(' + _bf.t('averaged') + ' ' + avg + ' ' + _bf.t('from') + ' ' + _bf_itemreviews.recordqty + ' ' + _bf.t('review') + (_bf_itemreviews.recordqty == 1 ? '' : 's') + ')')
                        .appendTo($(this))
                        .each(function()
                        {
                            $('._bf_reviews_qty').remove();

                            $('<em />').attr(
                            {
                                'class': '_bf_widget_control_subtxt _bf_reviews_qty',
                                'title': _bf_itemreviews.recordqty + ' ' + (_bf_itemreviews.recordqty == 1 ? _bf.t('entry') : _bf.t('entries'))
                            })
                            .html(_bf_itemreviews.recordqty)
                            .appendTo($('._bf_reviews_control'))
                        });
                    });
                })
            )
            .appendTo($('._bf_reviews'))
            .each(function()
            {
                if(typeof reviews.id != 'undefined')
                {
                    _bf_itemreviews.processReviews(reviews);
                }
                else
                {
                    if(!_bf_itemreviews.lazyloading)
                    {
                        $('<h2 />').attr(
                        {
                            'class': '_bf_no_reviews _bf_itemreviews'
                        })
                        .html(_bf.t('Why not be the first to post a review?'))
                        .appendTo($('._bf_reviews'));
                    }
                }

                _bf.widgetLoaded('reviews');
            });
        }

        _bf.widgetSwitch('reviews');

    },
    
    processReviews: function(reviews)
    {
        var i = 0;

        $(reviews.id)
        .each(function()
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
                isodate: reviews.isodate[i],
                tags: reviews.tags[i],
                number: _bf_itemreviews.itemqty + 1
            });

            i++;
            _bf_itemreviews.itemqty++;
        });
        
        $("a._bf_itemreviews_media_link").showBox(
        {
          'path': _bf.host,
          'speed': _bf.ani_speed,
          'default_img': _bf.host + 'images/' + _bf.no_image
        });

        $('.postdate').timeago();

        _bf_itemreviews.renderCrumbs(reviews);

        _bf.widgetLoaded('reviews');

        $('<div />').attr(
        {
            'class': '_bf_clear'
        })
        .appendTo($('._bf_reviews'));                

        //_bf.paginator(_bf_itemreviews, $('._bf_itemreviews'));
        _bf_itemreviews.setLazyLoader();  
    },
    
    setLazyLoader: function()
    {
        // lazy load?
        $(window).scroll(function()
        {
            if(_bf.current_widget == 'reviews')
            {
                if  ($(window).scrollTop() == $(document).height() - $(window).height())
                {
                   _bf_itemreviews.lazyLoad();
                }
            }
            
            _bf.sticky('reviews');
        });
        
        _bf_itemreviews.clearLazyLoader();
    },
    
    clearLazyLoader: function()
    {
        $('._bf_reviews_lazyloading').remove();
        _bf_itemreviews.lazyloading = false;                            
    },
    
    lazyLoad: function() 
    {
        _bf_itemreviews.lazyloading = true;
        
        if(!$('._bf_reviews_lazyloading').length)
        {
            $('<div />').attr(
            {
                'class': '_bf_reviews_lazyloading'
            })
            .html(_bf.t('Loading') + '...')
            .appendTo($('._bf_reviews'))
            .each(function()
            {
                _bf_itemreviews.limitfrom += _bf_itemreviews.limitqty;
                _bf_itemreviews.getReviews();
            });            
        }                    
    },
    
    renderCrumbs: function(reviews)
    {
        $('._bf_itemreviews_crumbs').remove();
        
        $('<p />').attr(
        {
            'class': '_bf_itemreviews_crumbs'
        })
        .html(_bf.t('Viewing' + ': '))
        .prependTo($('._bf_itemreviews_header'))
        .each(function()
        {
            $('<a />').attr(
            {
                'class': '_bf_itemreviews_crumb_all',
                'href': 'javascript:void(0)',
                'title': _bf.t('Show all reviews')
            })
            .html(_bf.t('all reviews'))
            .on(
            {
                click: function()
                {
                    _bf_itemreviews.itemqty = 0;
                    _bf_itemreviews.limitfrom = 0;
                    _bf_itemreviews.tagging = false;
                    _bf_itemreviews.getReviews();
                }
            })
            .appendTo($(this))
            
            if(typeof reviews.tagsearch != 'undefined')
            {
                $('<em />').attr(
                {
                    'class': '_bf_itemreviews_crumb_tag'
                })
                .html(" &#187; " + reviews.tagsearch)
                .appendTo($(this))
            }
        })
        
    },
    
    renderTags: function(review, obj)
    {
        // show tags
        if(review.tags)
        {
            $('<div />').attr(
            {
                'class': '_bf_itemreviews_tags'
            })
            .on(
            {
                mouseover: function()
                {                      
                    $(this).stop().animate(
                    {
                        opacity: 1
                    }, 
                    _bf.ani_speed)
                },
                mouseout: function()
                {
                    $(this).stop().animate(
                    {
                        opacity: 0.45
                    }, 
                    _bf.ani_speed)
                }                    
            })
            .html(_bf.t('Tagged') + ': ')
            .css(
            {
                opacity: 0.45
            })
            .each(function()
            {                
                var tags = review.tags.split(',');
                
                for(i = 0; i < tags.length; i++)
                {
                    var tag = tags[i].split(':');
                    
                    $('<a />').attr(
                    {
                        href: 'javascript:void(0)',
                        title: _bf.t('Find more reviews tagged with') + ' ' + tag[1],
                        rel: 'tag_' + tag[0],
                        'class': '_bf_itemreviews_tag_link'
                    })
                    .html(tag[1])
                    .appendTo($(this))
                    .on(
                    {
                        click:function()
                        {
                            _bf_itemreviews.itemqty = 0;
                            _bf_itemreviews.limitfrom = 0;
                            _bf_itemreviews.tagging = $(this).attr('rel');
                            _bf_itemreviews.getReviews();
                            $('html, body').animate(
                            {
                                scrollTop: $('._bf_widgets_holder').offset().top
                            }, 
                            _bf.ani_speed);
                        }
                    })
                    .each(function()
                    {
                        if(i < (tags.length - 1))
                        {
                            $(this).append(',');
                        }
                    });
                }
            })
            .prependTo(obj);
        }

    },

    renderReview: function(review)
    {
        var review = review;
        
        $('<li />').attr(
        {
            'class': '_bf_itemreviews_item',
            id: 'review_' + review.id
        })
        .appendTo($('._bf_itemreviews'))
        .each(function()
        {
            $('<span />').attr(
            {
                'class': '_bf_itemreviews_item_number'
            })
            .html(review.number)
            .appendTo($(this))
            
            $('<p />').attr(
            {
                'class': '_bf_itemreviews_item_synopsis'
            })
            .html(review.content.replace(/\\/g, ""))
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


                $('<div />').attr(
                {
                    'class': '_bf_itemreviews_arrow_left'
                })
                .prependTo($(this));
                
                // call expander plugin
                $(this).expander();
                
                _bf_itemreviews.renderTags(review, $(this));
            });

            $('<h3 />').attr(
            {
                'class': '_bf_itemreviews_item_username',
                title: review.gname + ' ' + review.fname
            })
            .html(' <em>' + _bf.t('Posted by') + '</em> ' + review.gname + ' ' + review.fname + ' <em class="postdate" title="'+review.isodate+'">' + review.fdate + '</em>')
            .appendTo($(this));
            
            $('<div />').attr(
            {
                'class': '_bf_itemreviews_avatarholder'
            })
            .appendTo($(this))
            .each(function()
            {
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
            });

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
                    path: _bf.host + 'api/plugins/raty/img',
                    half:      false
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
                            .css(
                            {
                                display: 'none'
                            })
                            .appendTo($(this))
                            .load(function()
                            {
                                $(this).fadeIn();
                            });
                        })
                        .appendTo($(this));
                    }
                })
                .appendTo($(this));
            }      
            
            // social networks
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

