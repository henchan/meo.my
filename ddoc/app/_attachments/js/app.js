$(function(){
  Backbone.couch_connector.config.db_name = "dev";
  Backbone.couch_connector.config.ddoc_name = "app";

  // If set to true, the connector will listen to the changes feed
  // and will provide your models with real time remote updates.
  Backbone.couch_connector.config.global_changes = true;
  
  // Enables Mustache.js-like templating.
  _.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
  };
  
  // The model for a cTag is kinda simple.
  // We only need a name, a text and a date.
  var CTagModel = Backbone.Model.extend({
    initialize : function(){
      if(!this.get("name")){
        this.set({"name": "Anonymous"});
      }
      if(!this.get("text")){
        this.set({"text": "Nothing"});
      }
      if(!this.get("date")){
        this.set({"date": new Date().getTime()});
      }
    }
  });
  
  // Now let's define a new Collection of CTags
  var CTagList = Backbone.Collection.extend({
    // The couchdb-connector is capable of mapping the url scheme
    // proposed by the authors of Backbone to documents in your database,
    // so that you don't have to change existing apps when you switch the sync-strategy
    url : "/cTags",
    model : CTagModel,
    // The cTags should be ordered by date
    comparator : function(cTag){
      return cTag.get("date");
    }
  });
  
  var CTags = new CTagList();
  
  // This view is responsible for creating the CTag fields.
  var EditView = Backbone.View.extend({
    el : $("#edit"),
    
    events : {
      "click #send" : "onSubmit"
    },
    
    initialize : function(){
      _.bindAll(this, "onSubmit");
    },
    
    // Simply takes the vals from the input fields and 
    // creates a new CTag.
    onSubmit : function(){
      var name = $("#name").val();
      var text = $("#text").val();
      // sanitize user input...you never know ;)
      name = name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
      text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
      CTags.create({
        "name" : name,
        "text" : text,
        "date" : new Date().getTime()
      });
    }
  });
  
  // Represents an cTag entry
  var EntryView = Backbone.View.extend({
    tagName : "tr",
    
    template : _.template($("#entry-template").html()),
    
    // Clicking the `X` leads to a deletion
    events : {
      "click .delete" : "deleteMe",
      "dblclick td" : "dummyFetch"
    },
    
    // If there's a change in our model, rerender it
    initialize : function(){
      _.bindAll(this, 'render', 'deleteMe', 'dummyFetch');
      this.model.bind('change', this.render);
    },
    
    dummyFetch : function(){
      // Fetch the state of the model from the server.
      // Used this to test the model sync.
      this.model.fetch();
    },
    
    render : function(){ 
      var content = this.model.toJSON();
      $(this.el).html(this.template(content));
      return this;
    },
    
    // Fade out the element and destroy the model
    deleteMe : function(){
      if(this.model)
        this.model.destroy();
      $(this.el).fadeOut("fast",function(){
        $(this).remove();
      });
    }
  });
  
  // The view for all cTags
  var CTagsTable = Backbone.View.extend({
    el: $("#cTags"),
    
    initialize : function(){
      _.bindAll(this, 'refreshed', 'addRow', 'deleted');
      
      CTags.bind("reset", this.refreshed);
      CTags.bind("add", this.addRow);
      CTags.bind("remove", this.deleted);
    },
    
    // Prepends an entry row 
    addRow : function(cTag){
      var view = new EntryView({model: cTag});
      var rendered = view.render().el;
      this.el.prepend(rendered);
    },
    
    // Renders all cTags into the table
    refreshed : function(){
      // reset the table
      $("#cTags").html("");
      if(CTags.length > 0){
        // add each element
        CTags.each(this.addRow);
      }
    },
    
    // A cTag has been deleted, so we rerender the table,
    // because this update could also come from another user via the
    // _changes feed
    deleted : function(){
      this.refreshed();
    }
    
  });
  
  // The App controller initializes the app by calling `CTags.fetch()`
  var App = Backbone.Router.extend({
    initialize : function(){
      CTags.fetch();
    }
  });
  
  new EditView();
  new CTagsTable();
  new App();

});
