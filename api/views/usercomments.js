/*
 * my comments
 */

var formname = 'usercomments';

if(_bf.loggedIn())
{
    if(!$('._bf_' + formname + '_form').length)
    {
        var _bf_usercomments = {

            init: function()
            {
                // post to api
                _bf.post(
                {
                    action: formname
                });
            },

            showComments: function(data)
            {
                var comments = $.parseJSON(data.usercomments);

                if(comments.length)
                {
                    $('<ul />').attr(
                    {
                        'class': '_bf_usercomments'
                    })
                    .css(
                    {
                        'display': 'none'
                    })
                    .appendTo($('._bf_dashboard'))
                    .each(function()
                    {
                        for(i = 0; i < comments.length; i++)
                        {
                            _bf_usercomments.renderComment(comments[i]);
                        }
                        
                        $(this).fadeIn(_bf.ani_speed);
                    });

                }
                else
                {
                    $('<div />').attr(
                    {
                        'class': '_bf_usercomments _bf_empty_dashboard'
                    })
                    .html(_bf.t('You have not posted any comments.'))
                    .hide()
                    .appendTo($('._bf_dashboard'))
                    .each(function()
                    {
                        $(this).fadeIn(_bf.ani_speed);
                    });
                }
            },
    
            renderComment: function(comment)
            {
                $('<li />').attr(
                {
                    'class': '_bf_usercomments_item'
                })
                .appendTo($('._bf_usercomments'))
                .each(function()
                {
                    $('<div />').attr(
                    {
                        'class': '_bf_usercomments_content'
                    })
                    .html(comment.content.substring(0, 100) + '...')
                    .appendTo($(this));

                    $('<em />').attr(
                    {
                        'class': '_bf_usercomments_posted'
                    })
                    .html(_bf.t('Posted') + ': ' + comment.fdate)
                    .appendTo($(this));
                    
                });
                
            }
        }
        
        _bf_usercomments.init();
    }
}


