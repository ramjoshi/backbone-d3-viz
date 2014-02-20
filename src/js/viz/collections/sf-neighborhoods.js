define([
  'js/common/collections/features'
], function(Features) {

  return Features.extend({

    url: require.toUrl('json/viz/sf-neighborhoods.json'),

    filterByZips: function(zips) {
      return this.filter(function(model) {
        return _.contains(zips, parseInt(model.id));
      });
    }
  });
});