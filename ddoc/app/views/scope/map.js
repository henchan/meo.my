function(doc) {
  if (doc.contents) {
    emit(doc.contents, doc);
  }
};