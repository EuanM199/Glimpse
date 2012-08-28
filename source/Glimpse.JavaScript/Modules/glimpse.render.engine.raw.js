﻿(function(engine, util) {
    var scrub = function(d) {
            return d.substr(1, d.length - 2);
        }, 
        provider = { 
            types: {
                italics : {
                    match: function (d) { return d.match(/^\_[\w\D]+\_$/) != null; },
                    replace: function (d) { return '<u>' + util.htmlEncode(scrub(d)) + '</u>'; },
                    trimmable: true
                },
                underline : {
                    match: function (d) { return d.match(/^\\[\w\D]+\\$/) != null; },
                    replace: function (d) { return '<em>' + util.htmlEncode(scrub(d)) + '</em>'; },
                    trimmable: true
                },
                strong : {
                    match: function (d) { return d. match(/^\*[\w\D]+\*$/) != null; },
                    replace: function (d) { return '<strong>' + util.htmlEncode(scrub(d)) + '</strong>'; },
                    trimmable: true
                },
                sub: {
                    match: function (d) { return d.indexOf('|(') >= 0 && d.indexOf(')|') >= 0; },
                    replace: function (d) { return util.htmlEncode(d).replace('|()|', '').replace('|(', '<span class="glimpse-sub-text">(').replace(')|', ')</span>'); },
                    trimmable: true
                },
                raw : {
                    match: function (d) { return d.match(/^\![\w\D]+\!$/) != null; },
                    replace: function (d) { return scrub(d); },
                    trimmable: false
                }
            },  
            process: function (data, charMax, charOuterMax, wrapEllipsis, skipEncoding) {
                var trimmable = true, 
                    replace = function (d) { return util.htmlEncode(d); };

                if (data == undefined || data == null)
                    return '--';
                if (typeof data != 'string')
                    data = data + '';  
                if (!skipEncoding) {
                    for (var typeKey in types) {
                        var type = types[typeKey];
                        if (type.match(data)) {
                            replace = type.replace;
                            trimmable = type.trimmable;
                            break;
                        }
                    }
                } 
                if (trimmable && charOuterMax && data.length > charOuterMax)
                    return replace(data.substr(0, charMax)) + (wrapEllipsis ? '<span>...</span>' : '...');

                return replace(data);
            }
        };
     
    engine.register('raw', provider);
})(glimpse.render.engine, glimpse.util);