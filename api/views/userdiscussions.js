/*
 * my reviews
 */

var formname = 'userdiscussions';

if(_bf.loggedIn())
{
    if(!$('._bf_' + formname + '_form').length)
    {
        var _bf_userdiscussions = {

            init: function()
            {
                // post to api
                _bf.post(
                {
                    action: formname
                });
            },

            showDiscussions: function(data)
            {
                var reviews = $.parseJSON(data.userdiscussions);

                if(reviews.length)
                {
                    $('<ul />').attr(
                    {
                        'class': '_bf_userdiscussions'
                    })
                    .appendTo($('._bf_dashboard'))
                    .each(function()
                    {
                        for(i = 0; i < reviews.length; i++)
                        {
                            _bf_userdiscussions.renderDiscussion(reviews[i]);
                        }
                    });

                }
                else
                {
                    // no discussions!
                }
            },
    
            renderDiscussion: function(review)
            {
                $('<li />').attr(
                {
                    'class': '_bf_userdiscussions_item'
                })
                .appendTo($('._bf_userdiscussions'))
                .each(function()
                {
                    $('<div />').attr(
                    {
                        'class': '_bf_userdiscussions_item_synopsis'
                    })
                    .html(review.content.substring(0, 100) + '...')
                    .appendTo($(this));

                    $('<em />').attr(
                    {
                        'class': '_bf_userdiscussions_item_posted'
                    })
                    .html(_bf.t('Posted') + ': ' + review.fdate)
                    .appendTo($(this));
                    
                });
                
            }
        }
        
        _bf_userdiscussions.init();
    }
}


