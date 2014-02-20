define([
  'js/common/collections/features'
], function(Features) {

  return Features.extend({

    url: require.toUrl('json/viz/sf-streets.json')
  });
});