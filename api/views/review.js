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
            filesTxt: _bf.t('Add images and videos to your review.') + '<br />',

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

                // add scripts
                $.get('api/plugins/uploadify/swfobject.js')
                .success(function()
                {
                    $.get('api/plugins/uploadify/jquery.uploadify.v2.1.4.min.js')
                    .success(function()
                    {
                        var div = $('<div />').attr(
                        {
                            'class': '_bf_newfile_holder _bf_button'
                        })
                        .html(_bf.t('Add a file'))
                        .appendTo(form);

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
                        .appendTo(form);
                    });
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
                    .html(_bf.t('Close'))
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
                        half: true,
                        scoreName: 'score',
                        path: _bf.host + 'api/plugins/raty/img/'
                    }).each(function()
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
                        'wmode'         : 'transparent',
                        'fileDataName'  : 'Filedata',
                        'hideButton'    : true,
                        'auto'          : true,
                        'fileExt'       : _bf.filetypes,
                        'fileDesc'      : _bf.t('Media Files') + ' (' + _bf.filetypes + ')',
                        'sizeLimit'     : _bf.maxfilesize,
                        'onSelect'      : function()
                                          {
                                              _bf.hideMultiSelect()
                                          },
                        'onComplete'    : function(event,queueID,fileObj,response,data)
                                          {
                                               _bf_review.addFile(response);
                                          }
                    });
                }
            },

            createObj: function(response)
            {
                // add file to the display, including the hover effect
                $('._bf_review_filestack').append
                (
                    $('<img />').attr(
                    {
                        'class': '_bf_review_file_thumb',
                        src: response,
                        alt: response,
                        height: '30px',
                        width: '30px'
                    }).click(function()
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


