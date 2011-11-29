/*
 * my reviews
 */

var formname = 'userreviews';

if(_bf.loggedIn())
{
    if(!$('._bf_' + formname + '_form').length)
    {
        var _bf_userreviews = {

            init: function()
            {
                // post to api
                _bf.post(
                {
                    action: formname
                });
            },

            showReviews: function(data)
            {
                var reviews = $.parseJSON(data.userreviews);

                if(reviews.length)
                {
                    $('<ul />').attr(
                    {
                        'class': '_bf_userreviews'
                    })
                    .appendTo($('._bf_dashboard'))
                    .each(function()
                    {
                        for(i = 0; i < reviews.length; i++)
                        {
                            _bf_userreviews.renderReview(reviews[i]);
                        }
                        
                        $(this).lionbars('light', true, true);
                    });

                }
                else
                {
                    // no reviews!
                }
            },
    
            renderReview: function(review)
            {
                $('<li />').attr(
                {
                    'class': '_bf_userreviews_item'
                })
                .appendTo($('._bf_userreviews'))
                .each(function()
                {
                    $('<a />').attr(
                    {
                        'class': '_bf_userreviews_item_title',
                        href: '#',
                        title: review.title
                    })
                    .html(review.title)
                    .appendTo($(this));

                    $('<div />').attr(
                    {
                        'class': '_bf_userreviews_item_synopsis'
                    })
                    .html(review.content.substring(0, 100) + '...')
                    .appendTo($(this));

                    $('<em />').attr(
                    {
                        'class': '_bf_userreviews_item_posted'
                    })
                    .html(_bf.t('Posted') + ': ' + review.fdate)
                    .appendTo($(this));
                    
                });
            }
        }
        
        _bf_userreviews.init();
    }
}


