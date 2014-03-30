define([
  'js/common/views/base',
  'hbs!tmpl/viz/map-info'
], function(BaseView,
            mapInfoTmpl) {
  return BaseView.extend({

    _zip: null,

    template: mapInfoTmpl,

    initialize: function(options) {
      this._sfHoods = options.sfHoods;
      this._sfHousingPrices = options.sfHousingPrices;
    },

    setZip: function(zip) {
      this._zip = zip;
    },

    getTemplateOptions: function() {
      var zip = parseInt(this._zip),
        hoods = this._sfHoods.findWhere({
          zip: zip
        }).get('hoods'),
        housingPrice = this._sfHousingPrices.findWhere({
          zip: zip
        });

      hoodsTxt = hoods[0] + ', ' + hoods[1] + ', ' + hoods[3];
      housingPriceTxt = '$' + housingPrice.get('zpctile50');
      return {
        zip: this._zip,
        hoods: hoodsTxt,
        housingPrice: housingPriceTxt
      }
    }
  });
});