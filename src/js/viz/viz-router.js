define([
  'js/common/router',
  'js/common/collections/features',
  'js/viz/collections/sf-neighborhoods',
  'js/viz/collections/sf-streets',
  'js/viz/collections/sf-housing-prices',
  'js/viz/views/viz-page',
  'js/viz/views/streets-legend',
  'js/common/views/map',
  'js/viz/views/sf-neighborhoods-geo.d3',
  'js/viz/views/sf-streets-geo.d3',
  'js/viz/views/viz-controls'
], function(BaseRouter,
            Features,
            SfNeighborhoods,
            SfStreets,
            SfHousingPrices,
            VizPageView,
            StreetsLegendView,
            MapView,
            SfNeighborhoodsGeoView,
            SfStreetsGeoView,
            VizControlsView) {

  return BaseRouter.extend({

    PageView: VizPageView,

    initialize: function() {
      BaseRouter.prototype.initialize.apply(this, arguments);

      _.invoke([
        this.sfNeighborhoods,
        this.sfStreets,
        this.sfHousingPrices
      ], 'fetch');
    },

    onDomReady: function() {
      BaseRouter.prototype.onDomReady.apply(this, arguments);
      
      _.invoke([
        this.streetsLegendView,
        this.mapView,
        this.sfNeighborhoodsGeoView,
        this.sfStreetsGeoView,
        this.vizControlsView
      ], 'render');
    },

    initCollections: function() {
      this.sfNeighborhoodFeatures = new Features();
      this.sfNeighborhoods = new SfNeighborhoods();
      this.sfStreets = new SfStreets();
      this.sfHousingPrices = new SfHousingPrices();
    },

    initViews: function() {
      this.streetsLegendView = new StreetsLegendView({
        el: '#streets-legend',
        colors: SfStreetsGeoView.PALETTE
      });
      this.mapView = new MapView({
        el: '#map-viz'
      });
      this.sfNeighborhoodsGeoView = new SfNeighborhoodsGeoView({
        className: 'neighborhoods',
        featureClassName: 'neighborhood',
        map: this.mapView.getMap(),
        collection: this.sfNeighborhoodFeatures,
        sfNeighborhoods: this.sfNeighborhoods,
        sfHousingPrices: this.sfHousingPrices
      });
      this.sfStreetsGeoView = new SfStreetsGeoView({
        className: 'streets',
        featureClassName: 'street',
        map: this.mapView.getMap(),
        collection: this.sfStreets
      });
      this.vizControlsView = new VizControlsView({
        el: '#viz-controls'
      });
    },

    initEvents: function() {
      this.sfNeighborhoods.on('sync', this.onSfNeighborhoods, this);

      this.vizControlsView.on('slider:change',
        this.sfNeighborhoodsGeoView.filter);
    },

    onSfNeighborhoods: function(collection) {
      this.mapView.fitFeatures(collection.toGeoJson());
    }
  });
});
