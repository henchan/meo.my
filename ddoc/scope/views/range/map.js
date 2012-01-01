function (doc) {
/*
  The calling application is responsible for checking whether :
     - a ddoc for the required focus exists. If not, create one (assuming user has privs).
     - a view up to at least the required range exists. If not, create one. Delete any view on the same focus with a narrower range.
   Requires a separate query for each breadth ... until ... (http://stackoverflow.com/questions/1468684/multiple-key-ranges-as-parameters-to-a-couchdb-view)

    view usage examples:
     get closest cTag in scope
       breadth=8            curl -X GET 'http://127.0.0.1:5984/dev/_design/scope/_view/range?include_docs=false&stale=update_after&limit=1&reduce=false'
       breadth=9            curl -X GET 'http://127.0.0.1:5984/dev/_design/scope/_view/range?startkey=256&include_docs=false&stale=update_after&limit=1&reduce=false'
     get cTags within specified range of the focus. 
        Range may be more tightly constrained than the scope specifies.    
       breadth=8            curl -X GET 'http://127.0.0.1:5984/dev/_design/scope/_view/range?startkey=0&endkey=212&include_docs=false&stale=update_after&reduce=false'
       breadth=9            curl -X GET 'http://127.0.0.1:5984/dev/_design/scope/_view/range?startkey=256&endkey=475&include_docs=false&stale=update_after&reduce=false'
     count cTags within specified range of the focus. 
       breadth=9            curl -X GET 'http://127.0.0.1:5984/dev/_design/scope/_view/range?startkey=256&endkey=475&include_docs=false&stale=update_after&reduce=true'
*/
    
    if (doc.contents) {
    
         var logBase2 = function(n) {
            return Math.log(n) / Math.LN2;
        };
    
        var 
            ISVIEW=true,
            scope = require('views/lib/func/requires').rr,
            breadth = logBase2(doc.contents.length) + scope.ENC_BITS;
            
            require('views/lib/func/range').
                scopeRange(doc, scope.CULTURE, scope.CONTENTS, scope.RANGE[breadth], ISVIEW);  
    }
}