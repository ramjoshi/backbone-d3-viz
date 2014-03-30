define([
  'js/common/router',
  'js/common/collections/features',
  'js/viz/collections/sf-neighborhoods-geo',
  'js/viz/collections/sf-streets-geo',
  'js/viz/collections/sf-hoods',
  'js/viz/collections/sf-housing-prices',
  'js/viz/views/viz-page',
  'js/viz/views/streets-legend',
  'js/viz/views/housing-prices-legend',
  'js/viz/views/map-info',
  'js/common/views/map',
  'js/viz/views/sf-neighborhoods-geo.d3',
  'js/viz/views/sf-streets-geo.d3',
  'js/viz/views/viz-controls'
], function(BaseRouter,
            Features,
            SfNeighborhoodsGeo,
            SfStreetsGeo,
            SfHoods,
            SfHousingPrices,
            VizPageView,
            StreetsLegendView,
            HousingPricesLegendView,
            MapInfoView,
            MapView,
            SfNeighborhoodsGeoView,
            SfStreetsGeoView,
            VizControlsView) {

  return BaseRouter.extend({

    PageView: VizPageView,

    sfHousingPricesDeferred: null,

    initialize: function() {
      BaseRouter.prototype.initialize.apply(this, arguments);

      this.sfHousingPricesDeferred = this.sfHousingPrices.fetch();
      _.invoke([
        this.sfNeighborhoodsGeo,
        this.sfStreetsGeo,
        this.sfHoods
      ], 'fetch');
    },

    onDomReady: function() {
      BaseRouter.prototype.onDomReady.apply(this, arguments);
      
      _.invoke([
        this.streetsLegendView,
        this.housingPricesLegendView,
        this.mapView,
        this.sfNeighborhoodsGeoView,
        this.sfStreetsGeoView,
        this.vizControlsView
      ], 'render');
    },

    initCollections: function() {
      this.sfNeighborhoodFeatures = new Features();
      this.sfNeighborhoodsGeo = new SfNeighborhoodsGeo();
      this.sfStreetsGeo = new SfStreetsGeo();
      this.sfHoods = new SfHoods();
      this.sfHousingPrices = new SfHousingPrices();
    },

    initViews: function() {
      this.streetsLegendView = new StreetsLegendView({
        el: '#streets-legend',
        colors: SfStreetsGeoView.PALETTE
      });
      this.housingPricesLegendView = new HousingPricesLegendView({
        el: '#housing-prices-legend',
        prices: SfNeighborhoodsGeoView.PRICES,
        colors: SfNeighborhoodsGeoView.PALETTE
      });
      this.mapInfoView = new MapInfoView({
        el: '#map-info',
        sfHoods: this.sfHoods,
        sfHousingPrices: this.sfHousingPrices
      });
      this.mapView = new MapView({
        el: '#map-viz'
      });
      this.sfNeighborhoodsGeoView = new SfNeighborhoodsGeoView({
        className: 'neighborhoods',
        featureClassName: 'neighborhood',
        map: this.mapView.getMap(),
        collection: this.sfNeighborhoodFeatures,
        sfNeighborhoodsGeo: this.sfNeighborhoodsGeo,
        sfHousingPrices: this.sfHousingPrices,
        sfHousingPricesDeferred: this.sfHousingPricesDeferred
      });
      this.sfStreetsGeoView = new SfStreetsGeoView({
        className: 'streets',
        featureClassName: 'street',
        map: this.mapView.getMap(),
        collection: this.sfStreetsGeo
      });
      this.vizControlsView = new VizControlsView({
        el: '#viz-controls'
      });
    },

    initEvents: function() {
      this.sfNeighborhoodsGeo.on('sync', this.onSfNeighborhoods, this);

      this.sfNeighborhoodsGeoView.on('mouseover:feature',
        this.onSfNeighborhoodMouseover, this);

      this.vizControlsView.on('slider:change',
        this.sfNeighborhoodsGeoView.filter);
    },

    onSfNeighborhoods: function(collection) {
      this.mapView.fitFeatures(collection.toGeoJson());
    },

    onSfNeighborhoodMouseover: function(feature) {
      this.mapInfoView.setZip(feature.id);
      this.mapInfoView.render();
    }
  });
});
