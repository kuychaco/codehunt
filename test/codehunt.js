// var myDataRef = new Firebase('https://codehunt-hr.firebaseio.com/');

// create model
var Resource = Backbone.Model.extend({
  defaults: { 
    name: "New Resource",
    votes: 0
  },
  upvote: function() {
    this.get()
  }
});

// Create a Firebase collection and set the 'firebase' property
// to the URL of your Firebase
var ResourceCollection = Backbone.Firebase.Collection.extend({
  model: Resource,
  url: "https://codehunt-hr.firebaseio.com/"
});

// A view for an individual resource item
var ResourceView = Backbone.View.extend({
  tagName:  "tr",
  template: _.template("<td> <button class='upvote'> <%= votes %> </button> </td> <td> <%= name %> </td> <td> <%= url %> </td>"),
  initialize: function() {
    this.listenTo(this.model, "change", this.render);
  },
  events: {
    "click .upvote" : function() {
      var votes = this.model.get('votes');
      console.log(votes);
      this.model.set('votes',votes+1);
    }
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
});

// The view for the entire application
var AppView = Backbone.View.extend({
  el: $('#codehuntapp'),
  events: {
    "click #add-resource" : "createResource",
    // "click .upvote" : function() {
    //   console.log('sdfd');
    // }
  },
  initialize: function() {
    this.list = this.$("#resource-list"); // the list to append to
    this.input = this.$("#new-resource"); // the textbox for new todos
    this.url = this.$("#url");

    // by listening to when the collection changes we
    // can add new items in realtime
    this.listenTo(this.collection, 'add', this.addOne);
  },
  addOne: function(resource) {
    var view = new ResourceView({model: resource});
    this.list.append(view.render().el);
  },
  createResource: function(e) {
    if (!this.input.val()) { return; }

    // create a new location in firebase and save the model data
    // this will trigger the listenTo method above and a new todo view
    // will be created as well
    this.collection.create({name: this.input.val(), url: this.url.val(), date: Date()});

    this.input.val('');
    this.url.val('');
  }
});

// Create a function to kick off our BackboneFire app
function init() {
  // debugger;
  // The data we are syncing from Firebase
  var collection = new ResourceCollection();
  var app = new AppView({ collection: collection });
}

// When the document is ready, call the init function
$(function() {
  init();
});

