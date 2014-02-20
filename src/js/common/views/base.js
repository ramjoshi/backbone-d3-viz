define([
  'backbone'
], function(Backbone) {
  return Backbone.View.extend({

    template: null,

    render: function() {
      this.$el.html(this.template(this.getTemplateOptions()));
    },

    getTemplateOptions: function() {}
  });
});