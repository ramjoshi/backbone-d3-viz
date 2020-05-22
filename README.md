## San Francisco Pavement Quality and Housing Prices

### A visualization using D3 + Leaflet + Backbone + RequireJS

[![SF Pavements and Housing screenshot](https://portfolio.ramjoshi.com/images/sf-hood01.jpg)][sf-streets-housing] [![SF Pavements and Housing screenshot](https://portfolio.ramjoshi.com/images/sf-hood02.jpg)][sf-streets-housing] [![SF Pavements and Housing screenshot](https://portfolio.ramjoshi.com/images/sf-hood03.jpg)][sf-streets-housing]

Live demo https://sfrealty.ramjoshi.com/

#### Projecting GeoJson data onto a Leaflet map using D3

See [D3 + Leaflet by Mike Bostock] [leaflet-d3].  

The core logic for projecting geojson using D3 is in [src/js/common/views/geo.d3.js]

This Backbone View manges the following functions
- Rendering geojson on a map
- Repositioning geojson svg when map bounds change
- D3 update pattern for binding data to geojson and animation
- Binding mouse events to geojson svg elements

[src/js/common/views/geo.d3.js] is an abstract base class.
Each visualization extends geo.d3.js
- [src/js/viz/views/sf-streets-geo.d3.js] renders the pavement quality geojson
- [src/js/viz/views/sf-neighborhoods-geo.d3.js] renders the neighborhoods geojson

geo.d3.js defines update, enter and exit methods that can be overriden to create a D3 animation for geojson svg paths.
For example, the pavement quality colors for streets are assigned in the D3 enter method of sf-streets-geo.d3.js.
The entire sf-streets-geo.d3.js module is less than 40 lines of code.

```js
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
```

#### Data
The data files referenced in this project can be found at https://github.com/ramjoshi/data

#### Inspired by
- (Mike Bostock)[leaflet-d3]
- (Stamen Studios)[stamen-studios]
- [Trulia]

[sf-streets-housing]: https://portfolio.ramjoshi.com/sf-streets-housing "SF Pavement Quality and Housing Prices"
[leaflet-d3]: https://bost.ocks.org/mike/leaflet/ "D3 + Leaflet"
[src/js/common/views/geo.d3.js]: https://github.com/ramjoshi/sf-streets-housing/blob/master/src/js/common/views/geo.d3.js
[src/js/viz/views/sf-streets-geo.d3.js]: https://github.com/ramjoshi/sf-streets-housing/blob/master/src/js/viz/views/sf-streets-geo.d3.js
[src/js/viz/views/sf-neighborhoods-geo.d3.js]: https://github.com/ramjoshi/sf-streets-housing/blob/master/src/js/viz/views/sf-neighborhoods-geo.d3.js
[stamen-studios]: https://studio.stamen.com/open/polymaps-org/ex/streets.html
[Trulia]: https://www.trulia.com/trends/vis/pricerange-sf/
