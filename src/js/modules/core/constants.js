/**=========================================================
 * Module: ColorsConstant.js
 =========================================================*/

(function() {
  'use strict';

  // Same MQ as defined in the css
  angular
    .module('naut')
    .constant('MEDIA_QUERY', {
      'desktopLG': 1400,
      'desktop':   992,
      'tablet':    768,
      'mobile':    480
    })
    .constant('DATE_FORMAT', {
        'formatString': 'dd/MM/yyyy'
    })
    .constant('IDLE_TIMEOUT_TIME', {
            timeToIdle: 60,                 // 60 seconds
            timeToTimeOut: (60 * 60 * 1),   // 1 hours
            timeToWarn: (60 * 55 * 1)           // 1 minute
        });

})();
