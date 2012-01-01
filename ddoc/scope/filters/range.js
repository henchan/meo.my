function (doc, req) {
/*
    Scope filter 
    Retrieve all cTags in the scope.
    the calling applicatiton is responsible for calculating range and cluster data for in scope cTags
*/
// curl -X GET 'http://127.0.0.1:5984/dev/_changes?filter=scope/range&include_docs=true'

    if (doc.contents) {
    
         var logBase2 = function(n) {
            return Math.log(n) / Math.LN2;
        };
    
        var 
            ISVIEW=false,
            scope = require('views/lib/func/requires').rr,
            breadth = logBase2(doc.contents.length) + scope.ENC_BITS;
            
            return require('views/lib/func/range').
                scopeRange(doc, scope.CULTURE, scope.CONTENTS, scope.RANGE[breadth], ISVIEW);  
    }    
}
