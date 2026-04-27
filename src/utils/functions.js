/* eslint-disable */
"use strict";

// Component Definition
export var Util = function () {
  return {
    // returns value of object child by string name
    // for nested children search
    getChildValue: function (o, s) {
      s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
      s = s.replace(/^\./, '');           // strip a leading dot
      var a = s.split('.');
      for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (typeof o !== "undefined" && k in o) {
          o = o[k];
        } else {
          return;
        }
      }
      return o;
    },

    array_column: function (array, column) {
      return array.map(e => e[column]);
    },

    array_sum: function (array) {
      return array.reduce(function (acc, val) { return acc + val; }, 0);
    },

    filterEmpty: function (obj) {
      return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== ''));
    },

    getCurrentUrl: function (location) {
      return location.pathname.split(/[?#]/)[0];
    },

    checkIsActive: function (location, url) {
      const current = this.getCurrentUrl(location);
      if (!current || !url) {
        return false;
      }

      if (current === url) {
        return true;
      }

      return current.indexOf(url) > -1;
    }
  }
}();

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  // module.exports = CrUtil;
}

export const percentageTwoNumber = (current, previous) => {
  let percentage = Math.abs((100 * ((current - previous) / Math.abs(previous)))).toFixed(2);
  return isNaN(percentage) ? '0' : isFinite(percentage) ? percentage : '100';
};
