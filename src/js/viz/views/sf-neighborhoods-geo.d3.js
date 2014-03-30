define([
  'js/common/views/geo.d3',
  'd3'
], function(GeoD3View,
            d3) {

  return GeoD3View.extend({

    _sfHousingPrices: null,

    _dataDeferred: null,

    initialize: function(options) {
      GeoD3View.prototype.initialize.apply(this, arguments);

      _.bindAll(this, 'filter');

      this._colors = d3.scale.linear()
        .domain(this.constructor.PRICES)
        .range(this.constructor.PALETTE);

      this._sfNeighborhoodsGeo = options.sfNeighborhoodsGeo;
      this._sfHousingPrices = options.sfHousingPrices;

      this._sfNeighborhoodsGeo.on('sync', this.reset, this);
      this._sfHousingPrices.on('sync', this.reset, this);
    },

    reset: function() {
      this.collection.reset(this._sfNeighborhoodsGeo.models);
    },

    enter: function(selection) {
      this.colorByPrice(selection);
    },

    update: function(selection) {
      this.colorByPrice(selection);
    },

    colorByPrice: function(selection) {
      var self = this;
      selection.each(function(data) {
        var medianHousingPrice,
          housingPrice = self._sfHousingPrices.findWhere({
            zip: parseInt(data.id)
          });
        if (housingPrice) {
          medianHousingPrice = housingPrice.get('zpctile50');
          d3.select(this).attr('fill', self._colors(medianHousingPrice/10000));
        }
      });
    },

    filter: function(percentileValues) {
      var zips = this._sfHousingPrices
          .filterByPercentileValues(percentileValues),
        filteredNeighbsGeo = this._sfNeighborhoodsGeo.filterByZips(zips);
      this.collection.reset(filteredNeighbsGeo);
    }
  }, {
    PRICES: _.range(30, 151, 20),
    PALETTE: ["#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5",
      "#084594"]
  });
});