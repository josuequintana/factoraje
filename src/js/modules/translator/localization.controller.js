/**=========================================================
 * Module: LocalizationController
 * Demo for locale settings
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('naut')
        .controller('LocalizationController', LocalizationController);
    /* @ngInject */
    function LocalizationController($rootScope, tmhDynamicLocale, $locale) {
      
      $rootScope.availableLocales = {
        'en': 'English',
        'es': 'Spanish',
        'de': 'German',
        'fr': 'French',
        'ar': 'Arabic',
        'ja': 'Japanese',
        'ko': 'Korean',
        'zh': 'Chinese'};
      
      $rootScope.model = {selectedLocale: 'en'};
      
      $rootScope.$locale = $locale;
      
      $rootScope.changeLocale = tmhDynamicLocale.set;

    }
    LocalizationController.$inject = ['$rootScope', 'tmhDynamicLocale', '$locale'];

})();
