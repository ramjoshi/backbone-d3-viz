define([
  'backbone'
], function(Backbone) {
  return Backbone.Router.extend({

    PageView: null,

    initDeferred: null,

    initialize: function() {
      this.initDeferred = new $.Deferred();
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
      this.initDeferred.resolve();
    },

    initModels: function() {},
    initCollections: function() {},
    initViews: function() {},
    initEvents: function() {}
  });
});