/* 
    Application: BiFrost
    Document   : review.js
    Created on : 27-Oct-2011, 21:37:22
    Author     : Paul Whitrow
    Description: JS to load for review posting
*/

var formname = 'review';

if(_bf.loggedIn())
{
    if(!$('._bf_' + formname + '_form').length)
    {
        var _bf_review = {

            fileStack: [],
            fileLimit: 6,
            filesTxt: _bf.t('Add media to your review.') + '<br />' + _bf.imagetypes + _bf.videotypes + '<br /><br />',

            init: function()
            {
                // create the form
                var form = $('<form />').attr(
                {
                    method: 'post',
                    action: formname,
                    name: formname,
                    'class': '_bf_state_form _bf_' + formname + '_form'
                });

                // create the inputs
                _bf.createFormElement(form,
                {
                    obj: 'input',
                    type: 'hidden',
                    name: 'parentid',
                    value: '',
                    title: ''
                });

                _bf.createFormElement(form,
                {
                    obj: 'input',
                    type: 'text',
                    name: 'title',
                    value: '',
                    title: _bf.t('Title')
                });

                _bf.createFormElement(form,
                {
                    obj: 'textarea',
                    name: 'content',
                    cols: '30',
                    rows: '8',
                    value: '',
                    title: _bf.t('Review')
                });

                _bf.createFormElement(form,
                {
                    obj: 'input',
                    type: 'text',
                    name: 'tags',
                    value: '',
                    readonly: true,
                    title: _bf.t('Tags')
                });
                
                // load multi select plugin
                $(form).multiselect();
                
                // create the submit button
                var submit = $('<div />').attr(
                {
                    'class': '_bf_button _bf_' + formname + '_submit'
                })
                .html(_bf.t('Submit'))
                .click(function(event)
                {
                    _bf.submitForm($(this).parent(), event);
                })
                .appendTo(form);

                // create the rating stars
                $('<div />').attr(
                {
                    'class': '_bf_review_rating_set'
                })
                .appendTo(form);


                var div = $('<div />').attr(
                {
                    'class': '_bf_dashright_panel'
                })
                .appendTo(form)
                .each(function()
                {
                    var div = $('<div />').attr(
                    {
                        'class': '_bf_newfile_holder _bf_button'
                    })
                    .html(_bf.t('Add media'))
                    .appendTo($(this));

                    var file = $('<input />').attr(
                    {
                        type: 'file',
                        id: 'newfile',
                        name: 'newfile',
                        'class': '_bf_' + formname + '_newfile _bf_ignore_validation'
                    }
                    ).appendTo(div);

                    $('<div />').attr(
                    {
                        'class': '_bf_review_filestack'
                    })
                    .html(_bf_review.filesTxt)
                    .appendTo($(this));   
                    
                });
                
                        
                _bf.state_panel.append(form)
                .each(function()
                {
                    _bf_review.raterReady();
                    _bf_review.uploaderReady();

                    $('._bf_state_actions').html($('<li />').attr(
                    {
                        'title': _bf.t('Click to close'),
                        'class': '_bf_state_action'
                    })
                    .html(_bf.t('Cancel'))
                    .click(function()
                    {
                        _bf.cleanUp($('._bf_' + formname + '_form'));

                        _bf.closePanel(function()
                        {
                            _bf.resizePanel(_bf.state_width_default, _bf.state_height_default);

                            _bf.showStateActions();
                        });
                     }));


                    var media = $('<input />').attr(
                    {
                        type: 'hidden',
                        name: 'media',
                        'class': '_bf_input _bf_' + formname + '_media _bf_ignore_validation'
                    }
                    ).appendTo(form);
                });
                
                // Facebook post checkbox
                if(typeof fb_lib != 'undefined')
                {
                    if(fb_lib.loggedin())
                    {
                        $('<div />').attr(
                        {
                            'class': '_bf_fb_linkpost'
                        })
                        .each(function()
                        {
                            $('<label />').attr(
                            {
                                'for': 'fb_post_review',
                                'class': 'fb_post_label'
                            })
                            .html(_bf.t('Post to') +  ' Facebook')
                            .prependTo($(this));
                            
                            $('<input />').attr(
                            {
                                'type': 'checkbox',
                                'name': 'fb_post_review',
                                'id': 'fb_post_review',
                                'class': 'fb_post_review',
                                'checked': 'checked'
                            })
                            .prependTo($(this));
                        })
                        .appendTo(form);                        
                    }
                }
                
                
            },
            
            raterReady: function()
            {
                // loop if rating script isn't loaded
                if(typeof $('._bf_review_rating_set').raty == 'undefined')
                {
                    setTimeout(function()
                    {
                        _bf_review.raterReady();
                    }, 10);
                }
                else
                {
                    // create the rater
                    $('._bf_review_rating_set').raty(
                    {
                        half: false,
                        scoreName: 'score',
                        path: _bf.host + 'api/plugins/raty/img/'
                    })
                    .each(function()
                    {
                        // attach our own requirements to the hidden field
                        $('input[name=score]').attr(
                        {
                            placeholder: 'Star Rating'
                        })
                        .addClass('_bf_input');
                    });

                    $('<em />').attr(
                    {
                        'class': '_bf_rater_prompt'
                    })
                    .html(_bf.t('Rate this...'))
                    .prependTo($('._bf_review_rating_set'));
                }
            },

            uploaderReady: function()
            {
                // loop if uploadify script isn't loaded
                if(typeof $('#newfile').uploadify == 'undefined')
                {
                    setTimeout(function()
                    {
                        _bf_review.uploaderReady();
                    }, 10);
                }
                else
                {
                    // kick off uploadify
                    $('#newfile').uploadify(
                    {
                        'uploader'      : _bf.host + 'api/plugins/uploadify/uploadify.swf',
                        'script'        : _bf.host + 'api/plugins/uploadify/uploadify.php',
                        'cancelImg'     : _bf.host + 'api/plugins/uploadify/cancel.png',
                        'folder'        : _bf.uploads,
                        'scriptData'    : {width: 1024, height:768},
                        'wmode'         : 'transparent',
                        'fileDataName'  : 'Filedata',
                        'hideButton'    : true,
                        'auto'          : true,
                        'scriptAccess'  : 'always', 
                        'fileExt'       : _bf.filetypes,
                        'fileDesc'      : _bf.t('Media Files') + ' (' + _bf.filetypes + ')',
                        'sizeLimit'     : _bf.maxfilesize,
                        'onCancel'      : function()
                                          {
                                              _bf.hideStateOverlay();
                                          },
                        'onSelect'      : function()
                                          {
                                              _bf.hideMultiSelect();
                                          },
                        'onOpen'        : function()
                                          {
                                              _bf.showStateOverlay(_bf.t('Uploading...'), 9999999);
                                          },
                        'onComplete'    : function(event,queueID,fileObj,response,data)
                                          {
                                              _bf.hideStateOverlay(function()
                                              {
                                                  _bf_review.addFile(response);
                                              })
                                          }
                    });
                }
            },

            createObj: function(response)
            {
                if(_bf.mediaType('video', response))
                {
                    response = _bf.host + 'images/' + _bf.vid_image;
                }
                    
                // add file to the display, including the hover effect
                $('._bf_review_filestack').append
                (
                    $('<img />').attr(
                    {
                        'class': '_bf_review_file_thumb',
                        src: _bf.host + 'images/wait-grey-mini.gif',
                        alt: response,
                        height: '30px',
                        width: '30px'
                    })
                    .each(function()
                    {
                        if(_bf.mediaType('image', response))
                        {
                            var img = _bf.basename(response).replace('.', '_thumb.');
                            var thumb = response.replace(_bf.basename(response), img);
                            $(this).attr('src', thumb);
                        }
                        else
                        {
                            $(this).attr('src', response);
                        }     
                    })
                    .click(function()
                    {
                        // display a clone of the image in state overlay
                        // and add controls
                        _bf.showStateOverlay($(this)
                        .clone()
                        .attr(
                        {
                            width: 'auto',
                            height: 'auto',
                            'class': '_bf_review_img_preview'
                        }),
                        'false',
                        function()
                        {
                            $('<ul />').attr(
                            {
                                'class': '_bf_review_file_thumb_actions'
                            })
                            .appendTo($('._bf_state_overlay'))

                            $('<li />').attr(
                            {
                                'class': '_bf_review_file_thumb_action'
                            })
                            .html(_bf.t('Close'))
                            .appendTo($('._bf_review_file_thumb_actions'))
                            .click(function()
                            {
                                _bf.hideStateOverlay();
                            });

                            $('<li />').attr(
                            {
                                'class': '_bf_review_file_thumb_action'
                            })
                            .html(':')
                            .appendTo($('._bf_review_file_thumb_actions'));

                            $('<li />').attr(
                            {
                                'class': '_bf_review_file_thumb_action'
                            })
                            .html(_bf.t('Remove'))
                            .appendTo($('._bf_review_file_thumb_actions'))
                            .click(function()
                            {
                                _bf_review.removeFile(response, function()
                                {
                                    _bf.hideStateOverlay();
                                });
                            });
                        });
                    })
                );

            },

            // add the uploaded file to the stack
            addFile: function(response)
            {
                // only upload if under limit
                if(_bf_review.fileStack.length < _bf_review.fileLimit)
                {
                    // show the thumbnail
                    _bf_review.createObj(_bf.host + _bf.uploads + '/' + _bf_basename(response));

                    // add to the stack array
                    _bf_review.fileStack.push(_bf_basename(response));

                    // update the hidden field
                    $('._bf_review_media').val(_bf_review.fileStack.join(','));
                }
                else
                {
                    _bf.showStateOverlay(_bf.t('You can only upload ' + _bf_review.fileLimit + ' items'));
                }
            },

            // remove file from the file stack
            removeFile: function(response, callback)
            {
                var tmp = [];

                $('._bf_review_filestack').html(_bf_review.filesTxt);

                // loop through the filestack, keep all but deleted file
                for(i = 0; i < _bf_review.fileStack.length; i++)
                {
                    if(_bf.basename(_bf_review.fileStack[i]) != _bf.basename(response))
                    {
                        // store in temp array
                        tmp.push(_bf_review.fileStack[i]);

                        // show the thumbnail
                        _bf_review.createObj(_bf.uploads + '/' + _bf_review.fileStack[i]);
                    }
                }

                // reset the filestack to temp array
                _bf_review.fileStack = tmp;

                // update the hidden field
                $('._bf_review_media').val(_bf_review.fileStack.join(','));

                if($.isFunction(callback))
                {
                    callback.call(this);
                }
            }
        }

        _bf_review.init();
    }
}


