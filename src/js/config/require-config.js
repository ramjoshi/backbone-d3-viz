require.config({

  baseUrl: 'src',

  paths: {
    'jquery': 'js/libs/jquery/jquery-1.9.1.min',
    'underscore': 'js/libs/underscore-1.6.0/underscore-min',
    'backbone': 'js/libs/backbone-1.1.1/backbone-min',
    'leaflet': 'js/libs/leaflet-0.7.2/leaflet',
    'd3': 'js/libs/d3/d3.v3.min',
    'Handlebars': 'js/libs/require-handlebars-0.4.0/Handlebars',
    'csvjson': 'js/libs/csvjson-2484bad/csvjson.min',

    // Require plugins
    'hbs': 'js/libs/require-hbs-0.4.0/hbs',

    // jQuery plugins
    'jquery-ui': 'js/libs/jquery-plugins/jquery-ui-1.10.2/jquery-ui.min',
    'rangeslider': 'js/libs/jquery-plugins/jQRangeSlider-5.6.0/jQRangeSlider-min',

    // Other paths
    'tmpl': 'templates',
  },

  deps: [
  ],

  // cache busting for a dev environment
  urlArgs: "bust=" + (new Date()).getTime(),

  shim: {
    'underscore': {
      exports: '_'
    },
    'backbone': {
      //These script dependencies should be loaded before loading
      //backbone.js
      deps: ['underscore', 'jquery'],
      //Once loaded, use the global 'Backbone' as the
      //module value.
      exports: 'Backbone'
    },
    'leaflet': {
      exports: 'L'
    },
    'd3': {
      exports: 'd3'
    },
    'csvjson': {
      exports: 'csvjson'
    },

     // jQuery plugins
    'jquery-ui': ['jquery'],
    'rangeslider': {
      deps: ['jquery-ui'],
      exports: 'rangeslider'
    }
  }
});

// Bootstrap the viz
require([
  'js/viz/viz-router'
], function(VizRouter) {
  var vizRouter = new VizRouter();
});