function (doc) {
/*
    synthetic view
    get a synthetic cTag by its Object of Synthesis (if specified)
        curl -H "Content-Type: application/json" -d '{"keys":["synth String"]}' -X POST http://127.0.0.1:5984/dev/_design/app/_view/synthetic?include_docs=true
*/
    if(doc.oos) {
        emit(doc.oos, null); 
	}
}