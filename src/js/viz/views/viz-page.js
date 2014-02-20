define([
  'js/common/views/base',
  'hbs!tmpl/viz/page'
], function(BaseView,
            vizPageTmpl) {
  return BaseView.extend({

    el: 'body',

    template: vizPageTmpl
  });
});