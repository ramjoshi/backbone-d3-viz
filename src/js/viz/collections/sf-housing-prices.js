define([
  'js/common/collections/csv-collection',
  'csvjson'
], function(CsvCollection) {

  return CsvCollection.extend({

    url: '/data/csv/sf-housing-prices.csv',

    filterByPercentileValues: function(percentileValues) {
      return this.chain().map(function(model) {
        var isModelPass = _.every(percentileValues,
          function(values, percentile) {
            var price = model.get(['zpctile' + percentile]);
            if (price >= values.min && price <= values.max) {
              return true;
            }
          });
        if (isModelPass) {
          return model.get('zip');
        }
      }).compact().value();
    }
  });
});