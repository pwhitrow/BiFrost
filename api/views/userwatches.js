/*
 * my watches
 */

var formname = 'userwatches';

if(_bf.loggedIn())
{
    if(!$('._bf_' + formname + '_form').length)
    {
        var _bf_userwatches = {

            init: function()
            {
                // post to api
                _bf.post(
                {
                    action: formname
                });
            },

            showWatches: function(data)
            {
                var watches = $.parseJSON(data.userwatches);

                if(watches.length)
                {
                    $('<ul />').attr(
                    {
                        'class': '_bf_userwatches'
                    })
                    .hide()
                    .appendTo($('._bf_dashboard'))
                    .each(function()
                    {
                        for(i = 0; i < watches.length; i++)
                        {
                            _bf_userwatches.renderWatch(watches[i]);
                        }
                        
                        $(this).fadeIn(_bf.ani_speed);
                    });

                }
                else
                {
                    // no watches!
                }
            },
    
            renderWatch: function(watch)
            {
                $('<li />').attr(
                {
                    'class': '_bf_userwatches_item'
                })
                .appendTo($('._bf_userwatches'))
                .each(function()
                {
                    $('<div />').attr(
                    {
                        'class': '_bf_userwatches_content'
                    })
                    .html(watch.title)
                    .appendTo($(this));                    
                });
                
            }
        }
        
        _bf_userwatches.init();
    }
}


