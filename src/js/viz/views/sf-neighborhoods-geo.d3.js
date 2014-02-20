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

      this._sfNeighborhoods = options.sfNeighborhoods;
      this._sfHousingPrices = options.sfHousingPrices;

      this._sfNeighborhoods.on('sync', this.onSfNeighborhoods);
    },

    onSfNeighborhoods: function() {
      this.collection.reset(this._sfNeighborhoods.models);
    },

    filter: function(percentileValues) {
      var filteredZips = this._sfHousingPrices
        .filterByPercentileValues(percentileValues);
      this.collection.reset(this._sfNeighborhoods.filterByZips(filteredZips));
    }
  });
});