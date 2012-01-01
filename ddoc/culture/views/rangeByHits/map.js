// Convert [breadth, range] key input to nearest hits output
// curl -X GET 'http://127.0.0.1:5984/dev/_design/culture/_view/rangeByHits?key=\[13,3917\]'
function (doc) {

    if (doc.thisculture) {           
        var 
            range = require('views/lib/func/stats').range,
            hits, breadth, halfLength;               
        
        for (breadth=8; breadth<16; breadth++) {
            halfLength = Math.pow(2, breadth-1);
            for (hits=0; hits <= halfLength; hits++) {
                emit([breadth, hits], range (hits, breadth));
            }
        }
    }
}