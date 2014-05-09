// Functions for date manipulation and formatting

define([
], function(
) {
    // Formats dict of form
    // {'months': x, 'days': x}
    // into a string 'x months, x days'.
    // Behaves correctly when x = 1 (1 month).
    // Optionally can omit x = 1 and write just 'month'

    var format_period = function(period, omit_ones) {
        if(period === undefined) {
            return '';
        }

        var keys = ['year', 'month', 'week', 'day'];
        var ret = [];

        // 'weeks' is not sent in period: recompute it
        var weeks = period.weeks || 0;
        var days = period.days || 0;
        if(days % 7 == 0) {
            period.weeks = weeks + parseInt(days/7);
            period.days = 0;
        };

        for(var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var key_plural = key + 's';
            var val = period[key_plural];
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
        };

        return ret.join(', ');
    }

    return {
        format_period: format_period
    }
});