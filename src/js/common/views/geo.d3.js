/**
* @fileoverview Defines a View that overlays geoJSON polygons using d3 on a
* Leaflet map.
* Renders polygons for geoJSON features in this.collection.
* Handles projection and repositioning of polygons on map 'viewreset'.
* Provides public methods enter(), exit() to animate polygons on
* collection 'reset'.
*
* A collection of geoJSON features will be rendered on a map as path elements.
* <svg>
*   <g>
*     <path d="">
*     <path d="">
*     ...
*   </g>
* </svg>
* Each path corresponds to a geoJSON feature, ex. a clu
* and represents the shape of the clu.
*/
define([
  'js/common/views/base',
  'd3',
  'leaflet'
], function(BaseView,
            d3,
            L) {
  return BaseView.extend({

    // The svg container element
    _containerEl: 'svg',

    // Wrapper nested inside the svg container element
    _wrapperEl: 'g',

    // Element used to render a geoJSON feature
    _featureEl: 'path',

    // An svg selection of all paths corresponding to all geoJSON features in
    // the collection.
    _features: null,

    // A geographic path generator.
    // Converts a geoJSON feature to an svg path element.
    // Initialized in initialize().
    // @see https://github.com/mbostock/d3/wiki/Geo-Paths#wiki-path
    _geoPathGenerator: null,

    // Leaflet map instance
    _map: null,

    // Class to apply to <path> elements
    _featureClassName: null,

    /**
    * @param {L.Map} options.map, a Leaflet map instance.
    *
    * @param {String} options.leafletPane, a leaflet pane
    * Possible values for this property are enumerated at
    * @link http://leafletjs.com/reference.html#map-panes
    * Defaults to 'overlayPane'.
    */
    initialize: function(options) {
      var leafletPane = options.leafletPane || 'overlayPane';
      this._map = options.map;
      this._featureClassName = options.featureClassName;
      this.el = this._map.getPanes()[leafletPane];
      this._geoPathGenerator =
        d3.geo.path().projection(_.bind(this._project, this));

      this.collection.on('reset', this._reset, this);
      this._map.on('viewreset', _.bind(this.reposition, this));
    },

    render: function() {
      this._d3Container && this._d3Container.remove();
      this._d3Container = d3.select(this.el).append(this._containerEl)
        .attr('class', [this.constructor.CLASSNAME_CONTAINER,
          this.className].join(' '));

      // Append a wrapper element that wraps all geoJSON features.
      // leaflet-zoom-hide class is assigned to the wrapper so that it is
      // hidden during Leaflet’s zoom animation
      this._d3Wrapper = this._d3Container.append(this._wrapperEl)
        .attr('class', 'leaflet-zoom-hide');

      this.collection.length && this._reset(this.collection);
      return this;
    },

    /**
    * Animates redrawing of polygons using d3's enter and exit selections.
    * @see http://strongriley.github.io/d3/#enter_and_exit
    * @private
    */
    _reset: function() {
      var enterSelection,
        exitSelection;
      this._features = this._d3Wrapper.selectAll(this._featureEl).data(
        this.getFeatures(), this.getFeatureKey);

      enterSelection = this._features.enter().append(this._featureEl)
        .attr('class', [this.constructor.CLASSNAME_FEATURE,
          this._featureClassName].join(' '));
      exitSelection = this._features.exit();

      this.update(this._features);
      this.enter(enterSelection);
      this.exit(exitSelection);

      this.bindEvents(enterSelection);
      this.reposition();
    },

    /**
    * @return {Array} of GeoJSON features to be projected on the map.
    * @public
    */
    getFeatures: function() {
      return this.collection.toGeoJson().features;
    },

    /**
    * @return {String} a unique identifier for the feature.
    * @protected
    */
    getFeatureKey: function(feature) {
      return feature && feature.id;
    },

    /**
    * Bind d3 event handlers on entering nodes.
    * @protected
    */
    bindEvents: function(enterSelection) {
      enterSelection.on('mouseover', _.bind(this.onFeatureMouseOver, this))
        .on('mouseout', _.bind(this.onFeatureMouseOut, this))
        .on('click', _.bind(this.onFeatureClick, this));
    },

    /**
    * Update existing nodes.
    * @param {Array} selection, d3 selection of existing nodes.
    * @protected
    */
    update: function(selection) {
    },

    /**
    * Handles rendering of nodes for entering data elements.
    * Entering data elements are those for which no corresponding dom nodes
    * currently exists. This comes into effect when we are applying filters to
    * elements and some elements get added and some filtered out.
    * The words enter and exit are adopted from stage terminology.
    * @see https://github.com/mbostock/d3/wiki/Selections#wiki-enter
    *
    * @param {Array} enterSelection, placeholder nodes for each data element
    * for which no corresponding existing DOM element was found in the
    * current selection.
    *
    * @protected
    */
    enter: function(enterSelection) {},

    /**
    * Handles rendering of nodes for exiting data elements.
    * https://github.com/mbostock/d3/wiki/Selections#wiki-exit
    *
    * @param {Array} exitSelection, existing DOM elements in the current
    * selection for which no new data element was found.
    *
    * @protected
    */
    exit: function(exitSelection) {
      exitSelection.remove();
    },

    /**
    * Reposition the SVG to cover the features.
    * Code borrowed from @link http://bost.ocks.org/mike/leaflet/
    *
    * @protected
    */
    reposition: function() {
      if (!this._features) {
        return; // no features to reposition
      }
      var bounds = this.getBoundsPx();
      if (!bounds) {
        return; // no view to reposition
      }
      var bottomLeft = bounds[0],
        topRight = bounds[1];
      this._d3Container.attr('width', topRight[0] - bottomLeft[0])
        .attr('height', bottomLeft[1] - topRight[1])
        .style('margin-left', bottomLeft[0] + 'px')
        .style('margin-top', topRight[1] + 'px');

      this._d3Wrapper.attr('transform', ['translate(',
      -bottomLeft[0], ',', -topRight[1], ')'].join(''));

      // Set the data attribute on features to redraw them
      this._features.attr('d', this._geoPathGenerator);
    },

    /**
    * @return {Array} Projected bounding box for the given geoJSON, described
    * in pixel points.
    *
    * A bounding box is a 2d Array  [​[left, bottom], [right, top]​],
    * where left is the minimum longitude, bottom is the minimum latitude,
    * right is maximum longitude, and top is the maximum latitude.
    * @link https://github.com/mbostock/d3/wiki/Geo-Paths#wiki-bounds
    */
    getBoundsPx: function() {
      var geoJSON = this.collection.toGeoJson();
      if (geoJSON.features.length == 0) return null;
      return _.map(d3.geo.bounds(geoJSON), this._project, this);
    },

    /**
    * @param {Array} latLngPoint, a list containing two Numbers - [lon, lat]
    * @return {Array} [x, y] projection in pixels for a point described in
    * latitude, longitude.
    * Code borrowed @link from http://bost.ocks.org/mike/leaflet/
    *
    * @private
    */
    _project: function(latLngPoint) {
      var layerPoint =
        this._map.latLngToLayerPoint(
          new L.LatLng(latLngPoint[1], latLngPoint[0]));
      return [layerPoint.x, layerPoint.y];
    },

    /**
    * @public
    */
    addClass: function(className) {
      this._d3Container.classed(className, true);
      return this._d3Container;
    },

    /**
    * @public
    */
    removeClass: function(className) {
      this._d3Container.classed(className, false);
      return this._d3Container;
    },

    hide: function() {
      this.addClass(this.constructor.CLASSNAME_INVISIBLE);
      return this;
    },

    show: function() {
      this.removeClass(this.constructor.CLASSNAME_INVISIBLE);
      return this;
    },

    visible: function() {
      return !this._d3Container.classed(this.constructor.CLASSNAME_INVISIBLE);
    },

    /**
    * @protected
    */
    onFeatureMouseOver: function(feature) {
      var featureEl = d3.select(d3.event.target);
      this.trigger('mouseover:feature', feature, featureEl);
    },

    /**
    * @protected
    */
    onFeatureMouseOut: function(feature) {
      var featureEl = d3.select(d3.event.target);
      this.trigger('mouseout:feature', feature, featureEl);
    },

    /**
    * @protected
    */
    onFeatureClick: function(feature) {
      d3.event.stopPropagation();
      var featureEl = d3.select(d3.event.target);
      this.trigger('click:feature', feature, featureEl);
    }
  }, {
    CLASSNAME_CONTAINER: 'geo-d3-container',
    CLASSNAME_FEATURE: 'geo-d3-feature',
    CLASSNAME_INVISIBLE: 'invisible'
  });
});