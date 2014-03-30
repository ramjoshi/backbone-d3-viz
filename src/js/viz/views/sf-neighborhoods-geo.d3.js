define([
  'js/common/views/geo.d3'
], function(GeoD3View) {

  return GeoD3View.extend({

    _sfHousingPrices: null,

    initialize: function(options) {
      GeoD3View.prototype.initialize.apply(this, arguments);

      _.bindAll(this,
        'filter',
        'onSfNeighborhoods'
      );

      this._sfNeighborhoodsGeo = options.sfNeighborhoodsGeo;
      this._sfHousingPrices = options.sfHousingPrices;

      this._sfNeighborhoodsGeo.on('sync', this.onSfNeighborhoods);
    },

    onSfNeighborhoods: function() {
      this.collection.reset(this._sfNeighborhoodsGeo.models);
    },

    filter: function(percentileValues) {
      var zips = this._sfHousingPrices
          .filterByPercentileValues(percentileValues),
        filteredNeighbsGeo = this._sfNeighborhoodsGeo.filterByZips(zips);
      this.collection.reset(filteredNeighbsGeo);
    }
  });
});