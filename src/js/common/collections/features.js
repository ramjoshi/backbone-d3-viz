define([
  'backbone'
], function(Backbone) {

  return Backbone.Collection.extend({

    parse: function(response) {
      return response.features;
    },

    toGeoJson: function() {
      var features = this.map(function(model) {
        return model.toJSON();
      });
      return this.constructor.featurestoGeoJson(features);
    }
  }, {
    // Class properties
    featurestoGeoJson: function(features) {
      return {
        type: 'FeatureCollection',
        features: features
      }
    }
  });
});