define([
  'js/common/views/base',
  'hbs!tmpl/viz/viz-controls',
  'rangeslider'
], function(BaseView,
            vizControlsTmpl) {

  return BaseView.extend({

    template: vizControlsTmpl,

    _percentiles: _.range(10, 100, 20),

    _sliderConfig: {
      bounds: {
        min: 100000,
        max: 3500000
      }
    },

    _percentileValues: null,

    events: {
      'valuesChanging .percentile-slider': '_onSlider'
    },

    initialize: function(options) {
      this._percentileValues = {};
      _.each(this._percentiles, function(percentile) {
        this._percentileValues[percentile] = this._sliderConfig.bounds;
      }, this);
    },

    render: function() {
      BaseView.prototype.render.apply(this, arguments);
      _.each(this.$('.percentile-slider'), this._renderSlider, this);
    },

    getTemplateOptions: function() {
      return {
        percentiles: _.map(this._percentiles, function(percentile) {
          return {
            percentile: percentile
          }
        })
      }
    },

    _renderSlider: function(el) {
      $(el).rangeSlider({
        bounds: this._sliderConfig.bounds,
        defaultValues: this._sliderConfig.bounds,
        step: 10000,
        formatter: function(val) {
          return '$' + val;
        }
      });
    },

    _onSlider: function(event, data) {
      var percentile = $(event.currentTarget).data('percentile');
      this._percentileValues[percentile] = data.values;
      this.trigger('slider:change', this._percentileValues);
    }
  });
});
