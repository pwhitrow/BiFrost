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
                            _bf_userwatches.renderWatch(watches[i], data.pageURL);
                        }
                        
                        $(this).fadeIn(_bf.ani_speed);
                    });

                }
                else
                {
                    $('<div />').attr(
                    {
                        'class': '_bf_userwatches _bf_empty_dashboard'
                    })
                    .html(_bf.t('You are not currently watching anything.'))
                    .hide()
                    .appendTo($('._bf_dashboard'))
                    .each(function()
                    {
                        $(this).fadeIn(_bf.ani_speed);
                    });
                }
            },
    
            renderWatch: function(watch, url)
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
                    .appendTo($(this))
                    .each(function()
                    {
                        $('<p />').attr(
                        {
                            'class': '_bf_userwatches_type'
                        })
                        .html(watch.type)
                        .appendTo($(this));
                        
                        $('<p />').attr(
                        {
                            'class': '_bf_userwatches_url'
                        })
                        .html(url)
                        .appendTo($(this));
                        
                        $('<span />').attr(
                        {
                            'class': '_bf_userwatches_control',
                            'title': _bf.t('Click to stop watching this item')
                        })
                        .html(_bf.t('Remove'))
                        .click(function()
                        {
                            // post to api
                            _bf.post(
                            {
                                action: 'removewatch',
                                id: watch.id,
                                relation: BiFrost.relation
                            });
                        })
                        .appendTo($(this));
                    });                    
                });
                
            }
        }
        
        _bf_userwatches.init();
    }
}


