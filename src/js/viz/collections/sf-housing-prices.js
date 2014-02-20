define([
  'backbone',
  'csvjson'
], function(Backbone) {

  return Backbone.Collection.extend({

    url: require.toUrl('csv/viz/sf-housing-prices.csv'),

    fetch: function(options) {
      options = _.defaults({
        dataType: 'text'
      }, options || {});
      Backbone.Collection.prototype.fetch.call(this, options);
    },

    parse: function(response) {
      if (_.isObject(response)) {
        return response;
      } else {
        var json = csvjson.csv2json(response, {
          delim: ',',
          textdelim: '\"'
        });
        return json.rows;
      }
    },

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