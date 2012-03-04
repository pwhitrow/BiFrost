/*
 * Expander - jQuery Plugin
 * Multi Tag Selector
 *
 * Copyright (c) 2011 - 2010 Paul Whitrow
 *
 * Version: 1.0 (18/11/2011)
 *
 */

(function($) {

    $.fn.multiselect = function(options) 
    {
        var defaults = {
            form: this
        };
        
        var options = $.extend(defaults, options);  
        
        init(options.form);
  
    };

    function init(form)
    {
        // create multi selector!
        var multi = $('<div />').attr(
        {
            'class': '_bf_multi_tags'
        })
        .appendTo(form)
        .each(function()
        {
            $('<div />').attr(
            {
                'class': '_bf_multiselect_item_default _bf_button'
            })
            .html(_bf.t('Select tags'))
            .click(function()
            {
                $('._bf_multiselect_holder').fadeToggle(_bf.ani_speed);
            })
            .appendTo($(this));
            
            $('._bf_review_tags').click(function()
            {
                $('._bf_multiselect_holder').fadeToggle(_bf.ani_speed);
            })

            getTags(form);
        });
    }
    
    function getTags(form)
    {
        $.post(_bf.host + 'api/_bf_api.php',
        {
            action: 'tags',
            api_key: _bf.api_key,
            api_token: _bf.api_token,
            dataType: 'json'
        },
        function(data)
        {
            var data = $.parseJSON(data);

            buildTagHolder(form, data);
        });
    }
    
    function buildTagHolder(form, data)
    {
        if($('._bf_multiselect_holder').length)
        {
            createTagList(form, data);
        }
        
        if(typeof data.tags['tag_id'] != 'undefined')
        {
            if(data.tags['tag_id'].length)
            {
                $('<div />').attr(
                {
                    'class': '_bf_multiselect_holder'
                })
                .appendTo($('._bf_multi_tags'))
                .hide()
                .each(function()
                {
                    $('<div />').attr(
                    {
                        'class': '_bf_input_newtag_done'
                    })
                    .appendTo($(this))
                    .each(function()
                    {
                        $('<div />').attr(
                        {
                            'class': '_bf_input_newtag_done_button _bf_button'
                        })
                        .html(_bf.t('Done'))
                        .appendTo($(this))
                        .click(function()
                        {
                            $('._bf_multiselect_holder').fadeToggle(_bf.ani_speed);
                        });
                    })

                    if(_bf.can_create_tags)
                    {
                        // create new tags item
                        $('<div />').attr(
                        {
                            'class': '_bf_multiselect_item_new'
                        })
                        .appendTo($(this))
                        .each(function()
                        {
                            $('<div />').attr(
                            {
                                'class': '_bf_form_row'
                            })
                            .appendTo($(this))
                            .each(function()
                            {
                                $('<label />').attr(
                                {
                                    'class': '_bf_input_newtag_label _bf_form_label',
                                    'for': '_bf_input_newtag'
                                })
                                .html(_bf.t('New Tag'))
                                .appendTo($(this));

                                $('<input />').attr(
                                {
                                    'class': '_bf_input_newtag _bf_input _bf_ignore_validation',
                                    'id': '_bf_input_newtag',
                                    'name': 'newtag'
                                })
                                .appendTo($(this));

                                $('<div />').attr(
                                {
                                    'class': '_bf_input_newtag_add _bf_button'
                                })
                                .html(_bf.t('Add'))
                                .appendTo($(this))
                                .click(function()
                                {
                                    var newTag = $('._bf_input_newtag');

                                    if(newTag.val() != '')
                                    {
                                        if(jQuery.inArray(newTag.val(), _bf_stopWords) < 0)
                                        {
                                            if(jQuery.inArray(newTag.val(), data.tags['tag_name']) < 0)
                                            {
                                                $.post(_bf.host + 'api/_bf_api.php',
                                                {
                                                    action: 'addtag',
                                                    api_key: _bf.api_key,
                                                    api_token: _bf.api_token,
                                                    dataType: 'json',
                                                    newtag: $('._bf_input_newtag').val()
                                                },
                                                function(data)
                                                {
                                                    var data = $.parseJSON(data);

                                                    newTag.val('').blur();

                                                    createTagList(form, data);
                                                });
                                            }
                                            else
                                            {
                                                _bf.showStateOverlay(_bf.t('New tag already in use!'), 2000, false, true);
                                            }
                                        }
                                        else
                                        {
                                            _bf.showStateOverlay(_bf.t('New tag is not permitted!'), 2000, false, true);
                                        }
                                    }
                                    else
                                    {
                                        _bf.showStateOverlay(_bf.t('No tag entered!'), 2000, false, true);
                                    }
                                });
                            });

                            _bf.checkPlaceholders(form);

                        });
                    }
                    else
                    {
                    }

                    createTagList(form, data);
                });
            }
            else
            {
                // no tags!
            }
        }
    }

    function createTagList(form, data)
    {
        if($('._bf_multiselect_items_holder').length)
        {
            $('._bf_multiselect_items_holder').remove();
        }

        $('<div />').attr(
        {
            'class': '_bf_multiselect_items_holder'
        })
        .appendTo($('._bf_multiselect_holder'))
        .each(function()
        {
            if(!_bf.can_create_tags)
            {
                $(this).css(
                {
                    'top': '0px'
                })
            }
            
            $('<ul />').attr(
            {
                'class': '_bf_multiselect_items'
            })
            .appendTo($(this))
            .each(function()
            {
                // create hidden input to hold tag ID's'
                _bf.createFormElement(form,
                {
                    obj: 'input',
                    type: 'hidden',
                    name: 'tagsid',
                    value: '',
                    title: ''
                });

                // create tag items
                for(i = 0; i < data.tags['tag_id'].length; i++)
                {
                    $('<li />').attr(
                    {
                        'class': '_bf_multiselect_item'
                    })
                    .appendTo($('._bf_multiselect_items'))
                    .each(function()
                    {
                        $('<input />').attr(
                        {
                            'class': '_bf_multiselect_item_checkbox',
                            'type': 'checkbox',
                            'name': '_bf_tags[]',
                            'id': '_bf_multiselect_item_checkbox_' + i,
                            'value': data.tags['tag_id'][i],
                            'checked': false
                        })
                        .appendTo($(this))
                        .click(function()
                        {
                            var tagnames = '';
                            var tagids = '';
                            var n = 0;

                            $('._bf_multiselect_item_checkbox').each(function()
                            {
                                if(typeof $(this).attr('checked') != 'undefined')
                                {
                                    tagnames += _bf.t(data.tags['tag_name'][n]) + ', ';
                                    tagids += _bf.t(data.tags['tag_id'][n]) + ',';
                                }

                                n++;
                            })

                            // show selected tag names
                            $('._bf_input_tags')
                            .val(tagnames)
                            .focus()
                            .blur();

                            // store tag IDs
                            $('._bf_input_tagsid').val(tagids);
                        });

                        $('<label />').attr(
                        {
                            'class': '_bf_multiselect_item_label',
                            'for': '_bf_multiselect_item_checkbox_' + i,
                            'title': _bf.t('Select this tag?')
                        })
                        .html(_bf.t(data.tags['tag_name'][i]))
                        .appendTo($(this));
                    });
                }
            });
        });
    }

})(jQuery);

var _bf_stopWords = [
  'a',
  'able',
  'about',
  'above',
  'abroad',
  'according',
  'accordingly',
  'across',
  'actually',
  'adj',
  'after',
  'afterwards',
  'again',
  'against',
  'ago',
  'ahead',
  'aint',
  'all',
  'allow',
  'allows',
  'almost',
  'alone',
  'along',
  'alongside',
  'already',
  'also',
  'although',
  'always',
  'am',
  'amid',
  'amidst',
  'among',
  'amongst',
  'an',
  'and',
  'another',
  'any',
  'anybody',
  'anyhow',
  'anyone',
  'anything',
  'anyway',
  'anyways',
  'anywhere',
  'apart',
  'appear',
  'appreciate',
  'appropriate',
  'are',
  'arent',
  'around',
  'as',
  'as',
  'aside',
  'ask',
  'asking',
  'associated',
  'at',
  'available',
  'away',
  'awfully',
  'b',
  'back',
  'backward',
  'backwards',
  'be',
  'became',
  'because',
  'become',
  'becomes',
  'becoming',
  'been',
  'before',
  'beforehand',
  'begin',
  'behind',
  'being',
  'believe',
  'below',
  'beside',
  'besides',
  'best',
  'better',
  'between',
  'beyond',
  'both',
  'brief',
  'but',
  'by',
  'c',
  'came',
  'can',
  'cannot',
  'cant',
  'cant',
  'caption',
  'cause',
  'causes',
  'certain',
  'certainly',
  'changes',
  'clearly',
  'cmon',
  'co',
  'co.',
  'com',
  'come',
  'comes',
  'concerning',
  'consequently',
  'consider',
  'considering',
  'contain',
  'containing',
  'contains',
  'corresponding',
  'could',
  'couldnt',
  'course',
  'cs',
  'currently',
  'd',
  'dare',
  'darent',
  'definitely',
  'described',
  'despite',
  'did',
  'didnt',
  'different',
  'directly',
  'do',
  'does',
  'doesnt',
  'doing',
  'done',
  'dont',
  'down',
  'downwards',
  'during',
  'e',
  'each',
  'edu',
  'eg',
  'eight',
  'eighty',
  'either',
  'else',
  'elsewhere',
  'end',
  'ending',
  'enough',
  'entirely',
  'especially',
  'et',
  'etc',
  'even',
  'ever',
  'evermore',
  'every',
  'everybody',
  'everyone',
  'everything',
  'everywhere',
  'ex',
  'exactly',
  'example',
  'except',
  'f',
  'fairly',
  'far',
  'farther',
  'few',
  'fewer',
  'fifth',
  'first',
  'five',
  'followed',
  'following',
  'follows',
  'for',
  'forever',
  'former',
  'formerly',
  'forth',
  'forward',
  'found',
  'four',
  'from',
  'further',
  'furthermore',
  'g',
  'get',
  'gets',
  'getting',
  'given',
  'gives',
  'go',
  'goes',
  'going',
  'gone',
  'got',
  'gotten',
  'greetings',
  'h',
  'had',
  'hadnt',
  'half',
  'happens',
  'hardly',
  'has',
  'hasnt',
  'have',
  'havent',
  'having',
  'he',
  'hed',
  'hell',
  'hello',
  'help',
  'hence',
  'her',
  'here',
  'hereafter',
  'hereby',
  'herein',
  'heres',
  'hereupon',
  'hers',
  'herself',
  'hes',
  'hi',
  'him',
  'himself',
  'his',
  'hither',
  'hopefully',
  'how',
  'howbeit',
  'however',
  'hundred',
  'i',
  'id',
  'ie',
  'if',
  'ignored',
  'ill',
  'im',
  'immediate',
  'in',
  'inasmuch',
  'inc',
  'inc.',
  'indeed',
  'indicate',
  'indicated',
  'indicates',
  'inner',
  'inside',
  'insofar',
  'instead',
  'into',
  'inward',
  'is',
  'isnt',
  'it',
  'itd',
  'itll',
  'its',
  'its',
  'itself',
  'ive',
  'j',
  'just',
  'k',
  'keep',
  'keeps',
  'kept',
  'know',
  'known',
  'knows',
  'l',
  'last',
  'lately',
  'later',
  'latter',
  'latterly',
  'least',
  'less',
  'lest',
  'let',
  'lets',
  'like',
  'liked',
  'likely',
  'likewise',
  'little',
  'look',
  'looking',
  'looks',
  'low',
  'lower',
  'ltd',
  'm',
  'made',
  'mainly',
  'make',
  'makes',
  'many',
  'may',
  'maybe',
  'maynt',
  'me',
  'mean',
  'meantime',
  'meanwhile',
  'merely',
  'might',
  'mightnt',
  'mine',
  'minus',
  'miss',
  'more',
  'moreover',
  'most',
  'mostly',
  'mr',
  'mrs',
  'much',
  'must',
  'mustnt',
  'my',
  'myself',
  'n',
  'name',
  'namely',
  'nd',
  'near',
  'nearly',
  'necessary',
  'need',
  'neednt',
  'needs',
  'neither',
  'never',
  'neverf',
  'neverless',
  'nevertheless',
  'new',
  'next',
  'nine',
  'ninety',
  'no',
  'nobody',
  'non',
  'none',
  'nonetheless',
  'noone',
  'no-one',
  'nor',
  'normally',
  'not',
  'nothing',
  'notwithstanding',
  'novel',
  'now',
  'nowhere',
  'o',
  'obviously',
  'of',
  'off',
  'often',
  'oh',
  'ok',
  'okay',
  'old',
  'on',
  'once',
  'one',
  'ones',
  'ones',
  'only',
  'onto',
  'opposite',
  'or',
  'other',
  'others',
  'otherwise',
  'ought',
  'oughtnt',
  'our',
  'ours',
  'ourselves',
  'out',
  'outside',
  'over',
  'overall',
  'own',
  'p',
  'particular',
  'particularly',
  'past',
  'per',
  'perhaps',
  'placed',
  'please',
  'plus',
  'possible',
  'presumably',
  'probably',
  'provided',
  'provides',
  'q',
  'que',
  'quite',
  'qv',
  'r',
  'rather',
  'rd',
  're',
  'really',
  'reasonably',
  'recent',
  'recently',
  'regarding',
  'regardless',
  'regards',
  'relatively',
  'respectively',
  'right',
  'round',
  's',
  'said',
  'same',
  'saw',
  'say',
  'saying',
  'says',
  'second',
  'secondly',
  'see',
  'seeing',
  'seem',
  'seemed',
  'seeming',
  'seems',
  'seen',
  'self',
  'selves',
  'sensible',
  'sent',
  'serious',
  'seriously',
  'seven',
  'several',
  'shall',
  'shant',
  'she',
  'shed',
  'shell',
  'shes',
  'should',
  'shouldnt',
  'since',
  'six',
  'so',
  'some',
  'somebody',
  'someday',
  'somehow',
  'someone',
  'something',
  'sometime',
  'sometimes',
  'somewhat',
  'somewhere',
  'soon',
  'sorry',
  'specified',
  'specify',
  'specifying',
  'still',
  'sub',
  'such',
  'sup',
  'sure',
  't',
  'take',
  'taken',
  'taking',
  'tell',
  'tends',
  'th',
  'than',
  'thank',
  'thanks',
  'thanx',
  'that',
  'thatll',
  'thats',
  'thats',
  'thatve',
  'the',
  'their',
  'theirs',
  'them',
  'themselves',
  'then',
  'thence',
  'there',
  'thereafter',
  'thereby',
  'thered',
  'therefore',
  'therein',
  'therell',
  'therere',
  'theres',
  'theres',
  'thereupon',
  'thereve',
  'these',
  'they',
  'theyd',
  'theyll',
  'theyre',
  'theyve',
  'thing',
  'things',
  'think',
  'third',
  'thirty',
  'this',
  'thorough',
  'thoroughly',
  'those',
  'though',
  'three',
  'through',
  'throughout',
  'thru',
  'thus',
  'till',
  'to',
  'together',
  'too',
  'took',
  'toward',
  'towards',
  'tried',
  'tries',
  'truly',
  'try',
  'trying',
  'ts',
  'twice',
  'two',
  'u',
  'un',
  'under',
  'underneath',
  'undoing',
  'unfortunately',
  'unless',
  'unlike',
  'unlikely',
  'until',
  'unto',
  'up',
  'upon',
  'upwards',
  'us',
  'use',
  'used',
  'useful',
  'uses',
  'using',
  'usually',
  'v',
  'value',
  'various',
  'versus',
  'very',
  'via',
  'viz',
  'vs',
  'w',
  'want',
  'wants',
  'was',
  'wasnt',
  'way',
  'we',
  'wed',
  'welcome',
  'well',
  'well',
  'went',
  'were',
  'were',
  'werent',
  'weve',
  'what',
  'whatever',
  'whatll',
  'whats',
  'whatve',
  'when',
  'whence',
  'whenever',
  'where',
  'whereafter',
  'whereas',
  'whereby',
  'wherein',
  'wheres',
  'whereupon',
  'wherever',
  'whether',
  'which',
  'whichever',
  'while',
  'whilst',
  'whither',
  'who',
  'whod',
  'whoever',
  'whole',
  'wholl',
  'whom',
  'whomever',
  'whos',
  'whose',
  'why',
  'will',
  'willing',
  'wish',
  'with',
  'within',
  'without',
  'wonder',
  'wont',
  'would',
  'wouldnt',
  'x',
  'y',
  'yes',
  'yet',
  'you',
  'youd',
  'youll',
  'your',
  'youre',
  'yours',
  'yourself',
  'yourselves',
  'youve',
  'z',
  'zero'
];
