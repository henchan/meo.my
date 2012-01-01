var by = function (name, minor) { // crockford
  
    return function (o, p) {        
        var a, b;
        if (o && p && typeof o === 'object' && typeof p === 'object') {
            a = o[name];
            b = p[name];
            if (a === b) {
                return typeof minor === 'function' ? minor(o, p) : 0;
            }
            if (typeof a === typeof b) {
                return b < a ? -1 : 1; // reversed
            }
            return typeof a < typeof b ? -1 : 1;
        } 
            else {
//            throw {
//                name: 'Error',
//                message: 'Expected an object when sorting by ' + name;
//            };
       }
    };
};
exports.by = by;