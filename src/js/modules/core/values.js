(function() {
  'use strict';

  angular
    .module('naut')
    .value('tokenExpirationTime', 60 * 60 * 24) // 24h
})();
