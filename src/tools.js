define([
        'underscore',
        'moment'
    ],
    function(
        _,
        moment
    ) {
        var duration_friendly_formatter = function(minutes) {
            if(!minutes) {
                return '';
            }

            var duration = moment.duration(minutes, 'minutes');

            var days = duration.days();
            var hours = duration.hours();
            var minutes = duration.minutes();

            var ret = '';

            if(days)
                ret += days + 'd ';
            if(hours)
                ret += hours + 'h ';
            if(minutes)
                ret += minutes + 'm';

            return ret;
        };

        var days_of_week = function() {
            var ret = {};
            var some_sunday = moment([2013, 1, 3]);

            for(var i = 0; i < 7; i++) {
                ret[i] = some_sunday.format('ddd');
                some_sunday.add(moment.duration(1, 'day'));
            }

            return ret;
        };

        var replace_vars = function(str, obj) {
            for(k in obj) {
                var r = new RegExp('%\\(' + k + '\\)', 'g');
                str = str.replace(r, obj[k]);
            }

            return str;
        }

        var replace_vars_recursive = function(obj, replacements) {
            // apply replace_vars(str, replacements) to every string found
            // in obj's values, recursively

            if(typeof(obj) == 'string') {
                return replace_vars(obj, replacements);
            } else {
                var ret = {};

                for(var k in obj) {
                    ret[k] = replace_vars_recursive(obj[k], replacements);
                }

                return ret;
            }
        }

        var urldecode = function(str) {
            // urldecode given string
            var mappings = {
                '=': /%3D/g,
                '?': /%3F/g
            }

            return replace_vars(str, mappings);
        };

        var get_url_parameters = function (name) {
            name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp( regexS );
            var results = regex.exec( window.location.href );
            if( results == null )
                return "";
            else
                return urldecode(results[1]);
        };

        var strip = function(str, chr) {
            var regexp;
            if(chr == undefined) {
                chr = '\\s';
            }

            regexp = new RegExp('^' + chr + '|' + chr + '$', 'g');

            return String(str).replace(regexp, '');
        };

        var startswith = function(str, substr) {
            return str.indexOf(substr) == 0;
        }

        var where_in = function(list, propertyName, values) {
            // filter list of objects having propertyName as element of values
            return _.filter(list, function(el) {
                return _.contains(values, el[propertyName]);
            });
        }

        var url_compare = function(url1, url2) {
            url1 = strip(url1, '/');
            url2 = strip(url2, '/');

            return (url1.indexOf(url2) > -1) || (url2.indexOf(url1) > -1);
        }

        var href_compare = function(url) {
            return url_compare(window.location.href, url);
        }

        var parse_url = function(url) {
            // extract pathname from url
            // Taken from
            // http://www.coderholic.com/javascript-the-good-parts/
            var ret = {};
            var parse_url_re = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;

            var result = parse_url_re.exec(url);

            var names = ['url', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash'];
            for (var i = 0; i < names.length; i += 1) {
                ret[names[i]] = result[i];
            }

            return ret;
        }

        // convert URL like ..photo.jpeg to ..photo-<X>x<Y>.jpeg
        // This is useful for getting thumbnails from some photo url
        var photo_url_thumbnail = function(url, X, Y) {
            var s = url.split('.');
            var path = s.slice(0, -1).join('.');
            var ext = s.slice(-1)[0];

            return path + '_' + X + 'x' + Y + '.' + ext;
        }

        return {
            duration_friendly_formatter: duration_friendly_formatter,
            days_of_week: days_of_week,
            replace_vars: replace_vars,
            replace_vars_recursive: replace_vars_recursive,
            urldecode: urldecode,
            get_url_parameters: get_url_parameters,
            strip: strip,
            where_in: where_in,
            url_compare: url_compare,
            href_compare: href_compare,
            parse_url: parse_url,
            photo_url_thumbnail: photo_url_thumbnail
        }
    }
);

