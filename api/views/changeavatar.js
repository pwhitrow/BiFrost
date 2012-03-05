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
            var form = $('<form />').attr(
            {
                method: 'post',
                action: formname,
                name: formname,
                enctype: 'multipart/form-data',
                'class': ' _bf_' + formname + '_form'
            })
            .css(
            {
                'display':'none'
            });

            var user = $.parseJSON(_bf.cookie('_bf_data'));
            
            var img = $('<img />').attr(
            {
                src: user.avatar,
                alt: _bf.t('Profile Picture for ' + user.gname + ' ' + user.fname),
                title: _bf.t('Profile Picture for ' + user.gname + ' ' + user.fname),
                'class': '_bf_dashboard_avatar',
                height: '120',
                width: '120'
            })
            .appendTo(form);

            var div = $('<div />').attr(
            {
                'class': '_bf_newavatar_holder _bf_button'
            })
            .html(_bf.t('Change Pic'))
            .appendTo(form);
            
            $('<div />').attr(
            {
                'class': '_bf_newavatar_text'
            })
            .html(_bf.t('Note: Whenever you use Facebook to login, your avatar will be reset to match your Facebook avatar.'))
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
                form.fadeIn(_bf.ani_speed);
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
                    'uploader'      : _bf.host + 'api/plugins/uploadify/uploadify.swf',
                    'script'        : _bf.host + 'api/plugins/uploadify/uploadify.php',
                    'cancelImg'     : _bf.host + 'api/plugins/uploadify/cancel.png',
                    'folder'        : _bf.uploads,
                    'wmode'         : 'transparent',
                    'fileDataName'  : 'Filedata',
                    'scriptAccess'  : 'always', 
                    'hideButton'    : true,
                    'auto'          : true,
                    'fileExt'       : _bf.imagetypes,
                    'fileDesc'      : _bf.t('Image Files') + ' (' + _bf.imagetypes + ')',
                    'sizeLimit'     : _bf.maxfilesize,
                    'onCancel'      : function()
                                      {
                                          _bf.hideStateOverlay();
                                      },
                    'onSelect'      : function()
                                      {
                                          // nada!
                                      },
                    'onOpen'        : function()
                                      {
                                          _bf.showStateOverlay(_bf.t('Uploading...'), 9999999);
                                      },
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
            $('._bf_dashboard_avatar').attr('src', _bf.host + img);

            // post to api
            _bf.post(
            {
                action: 'changeavatar',
                avatar: _bf.host + img,
                uploads: _bf.uploads
            });
            
            _bf.hideStateOverlay();
        }

        
    }
    
    _bf_changeavatar.init();

}



