define([
  'backbone'
], function(Backbone) {
  return Backbone.Router.extend({

    PageView: null,

    initialize: function() {
      this.pageView = new this.PageView();
      this.initModels();
      this.initCollections();
      $(document).ready(_.bind(this.onDomReady, this));
    },

    onDomReady: function() {
      Backbone.history.start();
      this.pageView.render();
      this.initViews();
      this.initEvents();
    },

    initModels: function() {},
    initCollections: function() {},
    initViews: function() {},
    initEvents: function() {}
  });
});