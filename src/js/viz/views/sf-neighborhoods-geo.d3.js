define([
  'js/common/views/geo.d3',
  'd3'
], function(GeoD3View,
            d3) {

  return GeoD3View.extend({

    _sfHousingPrices: null,
    _sfHousingPricesDeferred: null,

    initialize: function(options) {
      GeoD3View.prototype.initialize.apply(this, arguments);

      _.bindAll(this,
        'filter',
        'onSfNeighborhoods'
      );

      this._colors = d3.scale.linear()
        .domain(this.constructor.PRICES)
        .range(this.constructor.PALETTE);

      this._sfNeighborhoodsGeo = options.sfNeighborhoodsGeo;
      this._sfHousingPrices = options.sfHousingPrices;
      this._sfHousingPricesDeferred = options.sfHousingPricesDeferred;

      this._sfNeighborhoodsGeo.on('sync', this.onSfNeighborhoods);
    },

    onSfNeighborhoods: function() {
      $.when(this._sfHousingPricesDeferred).then(_.bind(function() {
        this.collection.reset(this._sfNeighborhoodsGeo.models);
      }, this));
    },

    enter: function(selection) {
      var self = this;
      selection.each(function(data) {
        var medianHousingPrice = self._sfHousingPrices.findWhere({
          zip: parseInt(data.id)
        }).get('zpctile50');
        d3.select(this).attr('fill', self._colors(medianHousingPrice/10000));
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