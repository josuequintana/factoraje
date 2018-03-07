/**=========================================================
 * Module: LocaleConfig.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .config(localeConfig);
  /* @ngInject */
  function localeConfig(tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.localeLocationPattern('vendor/angular-i18n/angular-locale_{{locale}}.js');
  }
  localeConfig.$inject = ['tmhDynamicLocaleProvider'];

})();

