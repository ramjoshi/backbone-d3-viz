define([
  'js/common/views/base',
  'hbs!tmpl/viz/streets-legend'
], function(BaseView,
            streetsLegendTemplate) {
  return BaseView.extend({

    template: streetsLegendTemplate,

    _colors: null,

    initialize: function(options) {
      this._colors = options.colors;
    },

    getTemplateOptions: function() {
      return {
        colors: _.map(this._colors, function(color) {
          return {
            color: color
          }
        })
      };
    }
  });
});
