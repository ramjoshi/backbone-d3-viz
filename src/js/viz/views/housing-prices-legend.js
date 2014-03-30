define([
  'js/common/views/base',
  'hbs!templates/viz/housing-prices-legend'
], function(BaseView,
            housingPricesLegendTemplate) {
  return BaseView.extend({

    template: housingPricesLegendTemplate,

    _prices: null,
    _colors: null,

    initialize: function(options) {
      this._prices = options.prices;
      this._colors = options.colors;
    },

    getTemplateOptions: function() {
      var pricesLength = this._prices.length;
      return {
        prices: _.chain(this._prices)
          .sortBy(function(price) {
            return -price;
          })
          .map(function(price, index) {
            var basePrice = 0,
              isLightText = false,
              originalIndex = pricesLength - index -1;

            if (originalIndex > 0) {
              basePrice = this._prices[originalIndex -1];
            }
            if (originalIndex >= this.constructor.MIN_INDEX_FOR_LIGHT_TEXT) {
              isLightText = true;
            }
            return {
              price: basePrice + ' - ' + price,
              color: this._colors[originalIndex],
              isLightText: isLightText
            }
          }, this).value()
      }
    }
  }, {
    MIN_INDEX_FOR_LIGHT_TEXT: 3
  });
});