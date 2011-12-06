/*
 * change avatar
 */

var formname = 'changeavatar';

if(!$('._bf_' + formname + '_form').length)
{
    var _bf_changeavatar = {
        
        init: function()
        {
            // create the form
            var form = $('<form></form>').attr(
            {
                method: 'post',
                action: formname,
                name: formname,
                'class': ' _bf_' + formname + '_form'
            });

            var user = $.parseJSON(_bf.cookie('_bf_data'));
            
            var img = $('<img />').attr(
            {
                src: user.avatar,
                alt: _bf.t('Profile Picture for ' + user.gname + ' ' + user.fname),
                title: _bf.t('Profile Picture for ' + user.gname + ' ' + user.fname),
                'class': '_bf_dashboard_avatar',
                height: '100',
                width: '100'
            })
            .appendTo(form);

            var div = $('<div />').attr(
            {
                'class': '_bf_newavatar_holder _bf_button'
            })
            .html(_bf.t('Change Pic'))
            .appendTo(form);

            // create the inputs
            var newav = $('<input />').attr(
            {
                type: 'file',
                id: 'newavatar',
                name: 'newavatar',
                'class': '_bf_' + formname + '_newavatar'
            }
            ).appendTo(div);

            $('._bf_dashboard')
            .append(form)
            .each(function()
            {
                _bf_changeavatar.uploaderReady();
            });
            
        },
        
        uploaderReady: function()
        {
            // loop if uploadify script isn't loaded
            if(typeof $('#newavatar').uploadify == 'undefined')
            {
                setTimeout(function()
                {
                    _bf_changeavatar.uploaderReady();
                }, 10);    
            }
            else
            {     
                // kick off uploadify
                $('#newavatar').uploadify(
                {
                    'uploader'      : 'api/plugins/uploadify/uploadify.swf',
                    'script'        : 'api/plugins/uploadify/uploadify.php',
                    'cancelImg'     : 'api/plugins/uploadify/cancel.png',
                    'folder'        : _bf.uploads,
                    'wmode'         : 'transparent',
                    'fileDataName'  : 'Filedata',
                    'hideButton'    : true,
                    'auto'          : true,
                    'fileExt'       : '*.jpeg;*.jpg;*.gif;*.png',
                    'fileDesc'      : 'Web Image Files (.JPEG, .JPG, .GIF, .PNG)',
                    'sizeLimit'     : 1048576,
                    'onComplete': function(event,queueID,fileObj,response,data)
                                  {
                                       _bf_changeavatar.setNewAvatar(response);
                                  }
                });                    
            }

        },

        setNewAvatar: function(img)
        {
            // update dashboard image
            $('._bf_dashboard_avatar').attr('src', img);

            // post to api
            _bf.post(
            {
                action: 'changeavatar',
                avatar: img,
                uploads: _bf.uploads
            });
        }

        
    }
    
    _bf_changeavatar.init();

}



