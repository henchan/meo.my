// Convert [breadth, range] key input to nearest hits output
// next highest hits step
//   curl -X GET 'http://127.0.0.1:5984/dev/_design/culture/_view/hitsByRange?startkey=\[13,0.094\]&limit=1'
// next lowest hits step
//   curl -X GET 'http://127.0.0.1:5984/dev/_design/culture/_view/hitsByRange?startkey=\[13,0.091\]&limit=1&descending=true'

function (doc) {

    if (doc.thisculture) {           
        var 
            range = require('views/lib/func/stats').range,
            hits, breadth, halfLength;               
        
        for (breadth=8; breadth<16; breadth++) {
            halfLength = Math.pow(2, breadth-1);
            for (hits=0; hits <= halfLength; hits++) {
                emit([breadth, range (hits, breadth)], hits);
            }
        }
    }
}