function (doc) {
/*
    cluster view
    view usage examples:
     get all scope data for clustering 
        curl -X GET 'http://127.0.0.1:5984/dev/_design/culture/_view/cluster?stale=update_after'
     get clustering value for a specified id
        curl -X GET 'http://127.0.0.1:5984/dev/_design/culture/_view/cluster?key=">0B1*Ey8<"&stale=update_after'
     get clustering values for a specified list of _ids
        curl -H "Content-Type: application/json" -d '{"keys":[">0B1*H6q<",">0B1*Ey8<"]}' -X POST http://127.0.0.1:5984/dev/_design/culture/_view/cluster?include_docs=false
*/
    var 
        culture = require('views/lib/application/defaults').CULTURE;
        
    if(doc.contents && doc.offsets) {
		if( doc.culture && doc.culture == culture) {
        	var
              appDef = require('views/lib/application/defaults').SYS_PARAMS,
    	 	  length = Math.pow(2, appDef.MIN_BREADTH), pos;			
            for( pos = 0; pos < length; pos++) {
                emit(doc._id, [pos, doc.offsets[pos]]); 
            }
		}
	}
}