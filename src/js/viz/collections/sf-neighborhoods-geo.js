define([
  'js/common/collections/features'
], function(Features) {

  return Features.extend({

    url: '/data/json/sf-neighborhoods-main.json',

    filterByZips: function(zips) {
      return this.filter(function(model) {
        return _.contains(zips, parseInt(model.id));
      });
    }
  });
});