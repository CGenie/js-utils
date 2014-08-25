// Functions for date manipulation and formatting

define([
], function(
) {
    'use strict';

    var with_weeks = function(period, add_zeros) {
        var keys = ['years', 'months', 'weeks', 'days'],
            weeks,
            days,
            period_c;

        if(period === undefined) {
            return {
                years: 0,
                months: 0,
                weeks: 0,
                days: 0
            };
        }

        period_c = JSON.parse(JSON.stringify(period));

        // 'weeks' is not sent in period: recompute it
        weeks = period_c.weeks || 0;
        days = period_c.days || 0;

        if(days % 7 == 0) {
            period_c.weeks = weeks + parseInt(days/7);
            period_c.days = 0;
        }

        if(!!add_zeros) {
            for(var i = 0; i < keys.length; i++) {
                period_c[keys[i]] = period_c[keys[i]] || 0;
            }
        }

        return period_c;
    };

    // Formats dict of form
    // {'months': x, 'days': x}
    // into a string 'x months, x days'.
    // Behaves correctly when x = 1 (1 month).
    // Optionally can omit x = 1 and write just 'month'

    var format_period = function(period, omit_ones) {
        var keys = ['year', 'month', 'week', 'day'],
            ret = [],
            period_c = with_weeks(period);

        if(period === undefined) {
            return '';
        }

        for(var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var key_plural = key + 's';
            var val = period_c[key_plural];
            var str = '';

            if(!!val) {
                str = val + ' ';
                if(val == 1) {
                    if(!!omit_ones) {
                        str = '';
                    }
                    str += key;
                } else {
                    str += key_plural;
                }

                ret.push(str);
            }
        }

        return ret.join(', ');
    };

    return {
        format_period: format_period,
        with_weeks: with_weeks
    };
});
