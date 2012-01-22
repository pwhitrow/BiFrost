/*
 * Dashboard
 */

//_bf_loadscript('api/plugins/lionbars/jQuery.lionbars.0.2.1.min.js');
//_bf_loadscript('api/plugins/lionbars/lionbars.css');

_bf.cleanUp($('._bf_dashboard'));

var _bf_dashboard = {
    
    init: function(callback)
    {
        // generate the dashboard
        var dashboard = $('<div />')
        .attr(
        {
            'class' : '_bf_dashboard'
        })
        .appendTo(_bf.state_panel)
        .each(function()
        {
            // generate the dashboard menu
            if(!$('._bf_dashboard_actions').length)
            {
                $('<ul />').attr(
                {
                    'class': '_bf_dashboard_actions'
                })
                .appendTo($('._bf_dashboard'))
                // using .each() trick to run something after element creation!
                .each(function()
                {
                    var items = [
                        ['Reviews', 'View all your reviews for this site', 'userreviews'],
                        ['Discussions', 'View all your discussions for this site', 'userdiscussions'],
                        ['Comments', 'View all your comments for this site', 'usercomments'],
                        ['Watches', 'Wiew items you are watching', 'mywatches'],
                        ['Update Email', 'Change your email address', 'changeemail'],
                        ['Update Password', 'Change your registered password', 'changepassword'],
                        ['Update Avatar', 'Change your account picture', 'changeavatar']
                    ];

                    for(i = 0; i < items.length; i++)
                    {
                        var el = $('<li />')
                        .text(_bf.t(items[i][0]))
                        .attr(
                        {
                            'class': '_bf_dashboard_action' + (i == 0 ? ' active_action' : ''),
                            'title': _bf.t(_bf.t(items[i][1])),
                            'rel': _bf.t(items[i][2])
                        })
                        .click(function()
                        {
                            _bf.changeDashboardView($(this));
                        })
                        .appendTo($('._bf_dashboard_actions'));
                        
                        if(i == items.length -1)
                        {
                            el.addClass('last')
                        }
                    }
                });
            }
        });

        if($.isFunction(callback))
        {
            callback.call(this);
        }
    }
}

_bf_dashboard.init(function()
{
    _bf.getForm({form: 'userreviews'});
});

                        
