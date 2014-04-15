// hack for localStorage getObj, setObj (to support JSON-fied objects)

define([
    ],
    function() {
        window.Storage.prototype.setObj = function(key, obj) {
            return this.setItem(key, JSON.stringify(obj))
        }
        window.Storage.prototype.getObj = function(key) {
            return JSON.parse(this.getItem(key))
        }
    });
