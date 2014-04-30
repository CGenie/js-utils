// Currency formatting functions

define([
        'tools'
    ],
    function(
        Tools
    ) {
        var _locale;

        var SETTINGS = {
            'en_US': {
                currency: '$',
                symbol_position: 'before',
                decimal: '.',
                decimal_places: 2,
                thousands: ',',
                empty: '-'
            },
            'pl_PL': {
                currency: 'zł',
                symbol_position: 'after',
                decimal: ',',
                decimal_places: 2,
                thousands: ' ',
                empty: '-'
            }
        }

        var locale_is_defined = function() {
            return (_locale !== undefined);
        }

        var current_locale = function() {
            if(locale_is_defined()) {
                return _locale;
            }

            return 'en_US';
        }

        var set_locale = function(locale) {
            if(locale !== undefined) {
                _locale = locale.split('.')[0];
            }
        }

        var settings = function() {
            return SETTINGS[current_locale()];
        }

        // taken from
        // http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
        // num -- price value
        // c -- number of decimal places
        // d -- decimal separator
        // t -- thousands separator
        var format_money = function(num, c, d, t, strip_decimal) {
            var n = num, 
                c = isNaN(c = Math.abs(c)) ? 2 : c, 
                d = d == undefined ? "." : d, 
                t = t == undefined ? "," : t, 
                s = n < 0 ? "-" : "", 
                i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
                j = (j = i.length) > 3 ? j % 3 : 0;
            var dec = c ? Math.abs(n - i).toFixed(c).slice(2) : '';
            if(!!strip_decimal) {
                dec = ((dec.length > 0) && parseInt(dec) !== 0) ? d + dec : '';
            } else {
                dec = (dec.length > 0) ? d + dec : '';
            }
            return s +
                (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
                dec;
        }

        // Format price but don't insert the currency symbol
        var format_price_no_currency = function(price, strip_decimal) {
            var s = settings();

            if((price === undefined) || (price === null)) {
                return s.empty || '-';
            }

            return format_money(price, s.decimal_places, s.decimal, s.thousands, strip_decimal);
        }

        // change the currency-formatted price into a standard float
        var unformat_price_no_currency = function(price) {
            var s = settings();
            var ret = new String(price);
            var last_decimal = ret.lastIndexOf(s.decimal);
            if(last_decimal > -1) {
                ret = ret.slice(0, last_decimal) + '.' + ret.slice(last_decimal + 1);
            } else {
                last_decimal = ret.length;
            }
            // now change the thousands separator to empty string
            // for price[0:last_decimal]
            var int_part = ret.slice(0, last_decimal);
            int_part = int_part.replace(new RegExp(s.thousands, 'g'), '');

            return parseFloat(int_part + ret.slice(last_decimal));
        }

        // Format price -- full format
        var format_price = function(price, strip_decimal) {
            var s = settings();

            if((price === undefined) || (price === null)) {
                return s.empty || '-';
            }

            var price = format_price_no_currency(price, strip_decimal);

            var format = s.format;
            if(format === undefined) {
                if(s.symbol_position == 'before') {
                    format = '%(currency)%(price)';
                } else {
                    format = '%(price)%(currency)';
                }
            }


            return Tools.replace_vars(
                format, {
                    price: price,
                    currency: s.currency
                });
        }

        return {
            locale_is_defined: locale_is_defined,

            settings: settings,
            set_locale: set_locale,

            format_price_no_currency: format_price_no_currency,
            unformat_price_no_currency: unformat_price_no_currency,

            format_price: format_price
        }
    });

