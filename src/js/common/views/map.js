define([
  'js/common/views/base',
  'leaflet'
], function(
  BaseView,
  L) {
  return BaseView.extend({

    config: {
      center: [40.4230, -98.7372], // center of the US
      zoom: 4
    },

    tileLayers: [
      {
        id: 'mqTile',
        url: 'http://mtile0{s}.mqcdn.com/tiles/1.0.0/vy/sat/{z}/{x}/{y}.png',
        options: {
          subdomains: '1234'
        },
        name: 'Satellite'
      },
      {
        id: 'mapnikBW',
        url: 'http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png',
        name: 'Mapnik B&W'
      },
    ],

    _baseLayers: null,

    // Leaflet map instance
    _map: null,

    getMap: function() {
      return this._map;
    },

    initialize: function(options) {
      this._map = L.map(this.$el[0], {
        attributionControl: false
      });

      this._baseLayers = {};
      this.initBaseLayers();

      this._layersControl = (new L.Control.Layers()).addTo(this._map);
    },

    render: function() {
      this._map.setView(this.config.center, this.config.zoom);
      this.addTileLayers();
      this.addLayersToControl();
      return this;
    },

    initBaseLayers: function() {
      _.each(this.tileLayers, function(layer) {
        var layerOptions = layer.options || {};
        this._baseLayers[layer.id] = L.tileLayer(layer.url, layerOptions);
      }, this);
    },

    addTileLayers: function() {
      _.each(this.tileLayers, function(layer) {
        this._baseLayers[layer.id].addTo(this._map);
      }, this);
    },

    /**
     * Add a widget to toggle between layers on the map.
     */
    addLayersToControl: function() {
      _.each(this.tileLayers, function(layer) {
        var baseLayer = this._baseLayers[layer.id];
        this._layersControl.addBaseLayer(baseLayer, layer.name);
      }, this);
    },

    fitFeatures: function(features) {
      var geoJson = L.geoJson(features);
      this._map.fitBounds(geoJson.getBounds());
    }
  }, {
    // Class properties
    getBounds: function(feature) {
      return L.geoJson(feature).getBounds();
    }
  });
});
