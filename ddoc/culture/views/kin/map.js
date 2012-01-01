function(doc) {
/*
  kin view
   emit a cTag's parents and children (1st generation) in this culture. Useful for MatchSelect tree walking
    view usage examples:    
     all kin
         curl -X GET 'http://127.0.0.1:5984/dev/_design/culture/_view/kin?startkey=\[">0B1*H6q<","X"\]&endkey=\[">0B1*H6q<","Z"\]&stale=update_after&include_docs=true&reduce=false'
     just the parent(s)
         curl -X GET 'http://127.0.0.1:5984/dev/_design/culture/_view/kin?startkey=\[">0B1*H6q<","X"\]&endkey=\[">0B1*H6q<","Y"\]&stale=update_after&include_docs=true&reduce=false'
     just the children
         curl -X GET 'http://127.0.0.1:5984/dev/_design/culture/_view/kin?key=\[">0B1*H6q<","Z"\]&stale=update_after&include_docs=true&reduce=false'
     count all kin
         curl -X GET 'http://127.0.0.1:5984/dev/_design/culture/_view/kin?startkey=\[">0B1*H6q<","X"\]&endkey=\[">0B1*H6q<","Z"\]&stale=update_after&include_docs=false&reduce=true'
*/
    if (doc.contents) {
        if (doc.X_id) {
            // X Parent
            emit([doc._id, 'X'], {
                _id: doc.X_id
            });
            // Child of X Parent
            emit([doc.X_id, 'Z'], {
                _id: doc._id
            });
        }
        if (doc.Y_id) {
            // Y Parent
            emit([doc._id, 'Y'], {
                _id: doc.Y_id
            });
            // Child of Y Parent
            emit([doc.Y_id, 'Z'], {
                _id: doc._id
            });
        }
    }
}