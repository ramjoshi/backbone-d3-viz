define([
  'js/common/views/geo.d3',
  'd3'
], function(GeoD3View,
            d3) {

  return GeoD3View.extend({

    _colors: null,

    initialize: function(options) {
      GeoD3View.prototype.initialize.apply(this, arguments);

      this._colors = d3.scale.linear()
        .domain([0, 50, 70, 100])
        .range(this.constructor.PALETTE);
    },

    getFeatureKey: function(feature) {

      // Return a unique id for this geojson feature
      return feature && feature.properties.CNN;
    },

    enter: function(selection) {
      var self = this;
      selection.each(function(data) {

        // Color each entering selection using a PCI score that indicates
        // the quality of a pavement on a scale of 0 through 100
        var pci = data.properties.PCI;
        d3.select(this).attr('stroke', self._colors(pci));
      });
    }
  }, {
    PALETTE: ["#F00", "#930", "#FC0", "#3B0"]
  });
});
